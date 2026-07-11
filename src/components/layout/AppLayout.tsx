import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-cyber-dark text-white flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-6 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
