import { Outlet } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";


export default function MainLayout() {
  return (
    <div className="flex">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        <AppHeader />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}