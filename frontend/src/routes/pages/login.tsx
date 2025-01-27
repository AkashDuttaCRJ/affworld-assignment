import { GoogleLogo } from "@/components/google-logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import * as z from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .min(1, { message: "Email is required." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [remember, setRemember] = useState(false);

  const { mutate: loginUser, isPending: loading } = useMutation({
    mutationFn: ({
      email,
      password,
      remember,
    }: {
      email: string;
      password: string;
      remember: boolean;
    }) => {
      return axios.post("/auth/login", { email, password, remember });
    },
  });

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginValues) {
    loginUser(
      {
        ...data,
        remember,
      },
      {
        onSuccess: (data) => {
          toast.success("Login successful!");
          const token = data.data.token;
          localStorage.setItem("token", token);
          navigate("/app");
        },
        onError(error) {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
          }
        },
      }
    );
  }

  return (
    <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          Your Company
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This app has saved me countless hours of work and helped me
              deliver stunning designs to my clients faster than ever
              before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only" htmlFor="email">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="name@example.com"
                          type="email"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only" htmlFor="password">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          placeholder="Password"
                          type="password"
                          autoCapitalize="none"
                          autoComplete="current-password"
                          autoCorrect="off"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between my-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={remember}
                      onCheckedChange={() => setRemember((prev) => !prev)}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </label>
                  </div>
                  <a
                    href="/forgot-password"
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              window.location.href = `${
                import.meta.env.VITE_API_URL
              }/auth/google`;
            }}
            disabled={loading}
          >
            <GoogleLogo className="h-4 w-4" />
            Google
          </Button>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
