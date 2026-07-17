import { Outlet } from "react-router-dom";
import { TopNav } from "./TopNav";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#03120d] text-slate-100 flex flex-col">
      <TopNav />
      <main className="flex-1 p-8 overflow-x-hidden overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
