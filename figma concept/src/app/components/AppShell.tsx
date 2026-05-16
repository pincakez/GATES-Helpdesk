import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ChatPanel } from "./ChatPanel";

const routeTitles: Record<string, string> = {
  "/app/tickets": "My Tickets",
  "/app/live-chat": "Live Chat",
  "/app/inbox": "Personal Inbox",
  "/app/offers": "Offers",
  "/app/warranty": "My Warranty",
  "/app/loyalty": "Loyalty Points",
  "/app/benefits": "My Benefits",
  "/app/profile": "My Profile",
};

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTitle = routeTitles[location.pathname] ?? "GATES Help Desk";

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <Topbar
        title={pageTitle}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop left sidebar */}
        <aside className="hidden md:flex w-60 flex-shrink-0 flex-col border-r border-gray-100 bg-white">
          <Sidebar onClose={() => {}} />
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="fixed left-0 top-0 bottom-0 w-60 z-50 flex flex-col bg-white shadow-xl md:hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                  <div className="text-xs font-semibold text-[#166534] tracking-widest uppercase">GATES</div>
                  <div className="text-sm font-bold text-gray-900">Help Desk</div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fb]">
          <Outlet />
        </main>

        {/* Right chat panel */}
        <aside className="hidden lg:flex w-80 flex-shrink-0 flex-col border-l border-gray-100 bg-white">
          <ChatPanel />
        </aside>
      </div>
    </div>
  );
}
