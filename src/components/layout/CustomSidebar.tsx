
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Users,
  Store,
  BarChart3,
  Phone,
  FileText,
  PenTool,
  MessageSquare,
  DollarSign,
  Database,
  Settings,
  LayoutDashboard,
  LogOut
} from "lucide-react";

export const CustomSidebar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Navigation items with icons and path based on the provided image
  const navItems = [
    { label: "الرئيسية", path: "/dashboard", icon: LayoutDashboard },
    { label: "إدارة", path: "#", icon: null, isHeader: true },
    { label: "الموظفين", path: "/employees", icon: Users },
    { label: "البراندات", path: "/brands", icon: Store },
    { label: "الإيرادات", path: "/revenues", icon: DollarSign },
    { label: "أقسام", path: "#", icon: null, isHeader: true },
    { label: "ميديا بايينج", path: "/media-buying", icon: BarChart3 },
    { label: "كول سنتر", path: "/call-center", icon: Phone },
    { label: "كتابة المحتوى", path: "/content", icon: FileText },
    { label: "التصميم", path: "/design", icon: PenTool },
    { label: "موديريشن", path: "/moderation", icon: MessageSquare },
    { label: "المالية", path: "#", icon: null, isHeader: true },
    { label: "المالية", path: "/finance", icon: DollarSign },
    { label: "النظام", path: "#", icon: null, isHeader: true },
    { label: "قاعدة البيانات", path: "/database", icon: Database },
    { label: "الإعدادات", path: "/settings", icon: Settings },
  ];
  
  if (!user) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <aside dir="rtl" className="bg-white border-l border-gray-200 w-64 flex-shrink-0 flex flex-col h-screen">
      <div className="h-16 border-b border-gray-200 flex items-center justify-center">
        <h2 className="text-xl font-bold text-green-600">Ecomistry</h2>
      </div>
      
      <nav className="p-4 flex-grow overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item, index) => {
            if (item.isHeader) {
              return (
                <li key={`header-${index}`} className="text-gray-500 text-sm py-2 mt-1">
                  {item.label}
                </li>
              );
            }
            
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
                  {Icon && <Icon size={20} />}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <button 
          onClick={handleSignOut}
          className="flex items-center w-full gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <LogOut size={20} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};
