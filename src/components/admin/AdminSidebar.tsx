import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Mail, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [newCasesCount, setNewCasesCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const adminSession = localStorage.getItem('admin_session');
  const admin = adminSession ? JSON.parse(adminSession) : null;

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('visa_cases')
        .select('id', { count: 'exact', head: true })
        .in('status', ['nouveau', 'dossier_complet']);
      setNewCasesCount(count ?? 0);
    };
    fetchCount();

    const channel = supabase
      .channel('sidebar-cases')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'visa_cases' },
        () => fetchCount()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: FileText,
      label: "Dossiers",
      path: "/admin/cases",
      badge: newCasesCount > 0 ? newCasesCount : undefined,
    },
    {
      icon: Users,
      label: "Clients",
      path: "/admin/clients"
    },
    {
      icon: Mail,
      label: "Notifications",
      path: "/admin/notifications"
    },
    {
      icon: Settings,
      label: "Paramètres",
      path: "/admin/settings"
    }
  ] as const;

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/admin/login');
  };

  return (
    <div className={cn(
      "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">
                UAE Visa Admin
              </h2>
              {admin && (
                <p className="text-sm text-sidebar-foreground/70">
                  {admin.full_name}
                </p>
              )}
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const badge = (item as any).badge as number | undefined;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  isCollapsed && "justify-center px-2"
                )}
                onClick={() => navigate(item.path)}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="truncate flex-1 text-left">{item.label}</span>
                    {badge !== undefined && (
                      <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-xs">
                        {badge}
                      </Badge>
                    )}
                  </>
                )}
                {isCollapsed && badge !== undefined && (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 h-10 text-destructive hover:text-destructive",
            isCollapsed && "justify-center px-2"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Déconnexion</span>}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;