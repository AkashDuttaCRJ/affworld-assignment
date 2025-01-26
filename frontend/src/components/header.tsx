import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CalendarCheck, Menu, Newspaper } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { UserDropdown } from "./user-dropdown";

const sidebarItems = [
  {
    label: "Feed",
    icon: Newspaper,
    path: "/app",
  },
  {
    label: "Task Management",
    icon: CalendarCheck,
    path: "/app/task-management",
  },
];

export function Header() {
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-5 md:px-10">
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-2 py-6">
              {sidebarItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  onClick={() => {
                    navigate(item.path);
                    setIsDrawerOpen(false);
                  }}
                  className="justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-center">
          <a href="/" className="flex items-center space-x-2">
            <span className="font-medium text-xl">Your Company</span>
          </a>
        </div>
        <div className="flex items-center justify-end space-x-4">
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
