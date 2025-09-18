import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Shield, Activity, History, Settings, Info, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import sihLogo from "@/assets/sih-logo.png";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: Shield, description: "Main overview and alerts" },
  { name: "Live Monitor", href: "/monitor", icon: Activity, description: "Real-time detection feed" },
  { name: "Detection History", href: "/history", icon: History, description: "Past gunshot events" },
  { name: "Settings", href: "/settings", icon: Settings, description: "System configuration" },
  { name: "System Info", href: "/system", icon: Info, description: "Hardware and model status" },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-dashboard-surface border-b border-dashboard-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          <div className="flex items-center gap-3">
            <img src={sihLogo} alt="Smart India Hackathon" className="h-8 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Gunshot Detection System</h1>
              <p className="text-sm text-muted-foreground">Real-time Audio Analysis Dashboard</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            System Online
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dashboard-surface border-r border-dashboard-border transform transition-transform duration-200 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <nav className="mt-4 px-4 space-y-2">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-muted rounded-lg transition-colors group"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5 text-primary group-hover:text-primary" />
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </a>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:ml-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}