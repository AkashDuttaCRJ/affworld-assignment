import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { axios } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  userIdentifier: z
    .string()
    .min(1, { message: "User identifier is required." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const { mutate: forgotPassword, isPending: loading } = useMutation({
    mutationFn: (data: { identifier: string }) => {
      return axios.post("/auth/forgot-password", data);
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userIdentifier: "",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    forgotPassword(
      { identifier: data.userIdentifier },
      {
        onSuccess: (data) => {
          toast.success(data.data.message);
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
          }
        },
      }
    );
  };

  return (
    <div className="container h-screen mx-auto py-10 flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your username or email to reset your password.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardContent>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="userIdentifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="userIdentifier">
                        Username or Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="userIdentifier"
                          type="text"
                          placeholder="Enter your username or email"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending Reset Link..." : "Reset Password"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
