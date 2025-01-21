import { Header } from "@/components/header";
import { Outlet } from "react-router";

export default function AppPage() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}
