"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  FolderOpen,
  Languages,
  BarChart3,
  Clock,
  Wrench,
  Mail,
  LogOut,
  Menu,
  X,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard", id: "overview" },
  { label: "Profile & Hero", icon: User, href: "/dashboard?tab=profile", id: "profile" },
  { label: "Projects", icon: FolderOpen, href: "/dashboard?tab=projects", id: "projects" },
  { label: "Stats", icon: BarChart3, href: "/dashboard?tab=stats", id: "stats" },
  { label: "Timeline", icon: Clock, href: "/dashboard?tab=timeline", id: "timeline" },
  { label: "Services", icon: Wrench, href: "/dashboard?tab=services", id: "services" },
  { label: "Contact & Social", icon: Mail, href: "/dashboard?tab=contact", id: "contact" },
  { label: "Translations", icon: Languages, href: "/dashboard?tab=translations", id: "translations" },
  { label: "Profile Image", icon: ImageIcon, href: "/dashboard?tab=image", id: "image" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '.') {
        e.preventDefault();
        setIsCollapsed(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-background/95 backdrop-blur-xl transition-all duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-[80px]" : "w-[260px]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 min-h-[73px]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white text-xs font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              A/
            </div>
            {!isCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold whitespace-nowrap">Admin Panel</motion.span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === "/dashboard" && item.id === currentTab;

            return (
              <div key={item.id} className="relative group">
                <motion.button
                  onClick={() => {
                    router.push(item.href);
                    setSidebarOpen(false);
                  }}
                  whileHover={{ x: 2 }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent",
                    isCollapsed ? "justify-center" : "justify-start"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                </motion.button>
                
                {/* Tooltip on hover when collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 rounded-md bg-foreground text-background px-2.5 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-border p-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground mb-2"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /> Sembunyikan</>}
          </button>
          
          <div className="relative group">
            <button
              onClick={handleLogout}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-all duration-200 hover:bg-red-500/10",
                isCollapsed ? "justify-center" : "justify-start"
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>Keluar</span>}
            </button>
            {isCollapsed && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 rounded-md bg-foreground text-background px-2.5 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg">
                Keluar
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isCollapsed ? "lg:pl-[80px]" : "lg:pl-[260px]"
        )}
      >
        {/* Top bar (mobile) */}
        <header className="flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 py-3 lg:hidden sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted text-foreground"
          >
            <Menu className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold">Dashboard</span>
          <div className="w-9" />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
