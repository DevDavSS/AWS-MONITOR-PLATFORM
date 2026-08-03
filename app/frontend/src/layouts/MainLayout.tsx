import { Outlet } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";

export default function MainLayout() {

    return (

        <div>

            <AppSidebar />

            <div className="ml-60 flex min-h-screen flex-1 flex-col">

                <AppHeader />
            <main className="pt-[140px] p-6">
                <Outlet />
            </main>

            </div>

        </div>

    );

}