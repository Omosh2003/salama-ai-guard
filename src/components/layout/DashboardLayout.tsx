import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import TopBar from "./TopBar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="ml-64 flex flex-1 flex-col">
        <TopBar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
