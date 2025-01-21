import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import { UserDropdown } from "./user-dropdown";

export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-10">
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[300px] sm:w-[400px]"
          ></SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-center">
          <a href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">YourBrand</span>
          </a>
        </div>
        <div className="flex items-center justify-end space-x-4">
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
