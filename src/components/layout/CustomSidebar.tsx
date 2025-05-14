
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Users,
  Store,
  BarChart3,
  Phone,
  LineChart,
  FileText,
  MessageSquare,
  PenTool,
  DollarSign,
  Settings,
  Database,
} from "lucide-react";

export const CustomSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Navigation items with icons and path
  const navItems = [
    { label: "الموظفين", path: "/employees", icon: Users },
    { label: "البراندات", path: "/brands", icon: Store },
    { label: "الميديا بايينج", path: "/media-buying", icon: BarChart3 },
    { label: "كول سنتر", path: "/call-center", icon: Phone },
    { label: "كتابة المحتوى", path: "/content", icon: FileText },
    { label: "موديريشن", path: "/moderation", icon: MessageSquare },
    { label: "التصميم", path: "/design", icon: PenTool },
    { label: "المالية", path: "/finance", icon: DollarSign },
    { label: "قاعدة البيانات", path: "/database", icon: Database },
    { label: "الإعدادات", path: "/settings", icon: Settings },
  ];
  
  if (!user) return null;

  return (
    <aside dir="rtl" className="bg-white border-l border-gray-200 w-64 flex-shrink-0">
      <div className="h-16 border-b border-gray-200 flex items-center justify-center">
        <h2 className="text-xl font-bold">لوحة التحكم</h2>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath.startsWith(item.path);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-green-50 text-green-700" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
