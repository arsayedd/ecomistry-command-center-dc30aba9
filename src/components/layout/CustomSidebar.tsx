
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Building2,
  Calendar,
  CircleDollarSign,
  Coins,
  FileEdit,
  MessageSquare,
  Phone,
  Settings,
  ShoppingCart,
  Smartphone,
  Users,
} from "lucide-react";

const menuItems = [
  {
    title: "الرئيسية",
    path: "/dashboard",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "إدارة البراندات",
    path: "/brands",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    title: "إدارة الموظفين",
    path: "/employees",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "ميديا بايينج",
    path: "/media-buying",
    icon: <Smartphone className="h-5 w-5" />,
  },
  {
    title: "كول سنتر",
    path: "/call-center",
    icon: <Phone className="h-5 w-5" />,
  },
  {
    title: "المودريشن",
    path: "/moderation",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "كتابة المحتوى",
    path: "/content",
    icon: <FileEdit className="h-5 w-5" />,
  },
  {
    title: "النظام المالي",
    path: "/finance",
    icon: <CircleDollarSign className="h-5 w-5" />,
  },
  {
    title: "العمولات",
    path: "/commissions",
    icon: <Coins className="h-5 w-5" />,
  },
  {
    title: "قاعدة البيانات",
    path: "/database",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    title: "الإعدادات",
    path: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function CustomSidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "h-screen bg-white border-l transition-all duration-300 overflow-hidden",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 border-b flex items-center justify-center p-4">
          <div className="flex items-center justify-center">
            <span className={cn("text-xl font-bold text-green-600", isCollapsed && "hidden")}>
              Ecomistry
            </span>
            <span className={cn("hidden", isCollapsed && "block text-xl font-bold text-green-600")}>
              E
            </span>
          </div>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 ml-4 mt-2 mb-2 border rounded-full w-8 h-8 flex items-center justify-center self-end"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          )}
        </button>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-2">
          <div className="space-y-1 px-3">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-green-50 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100",
                  isCollapsed && "justify-center"
                )}
              >
                {item.icon}
                {!isCollapsed && <span>{item.title}</span>}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Current Date */}
        <div className={cn(
          "p-4 border-t text-center text-xs text-gray-500",
          isCollapsed && "text-center p-2"
        )}>
          <div className="flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            {!isCollapsed && (
              <span>{new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
