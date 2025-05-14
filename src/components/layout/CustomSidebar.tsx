
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  BarChart3,
  PhoneCall,
  FileEdit,
  PenTool,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";

export function CustomSidebar() {
  const { signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      name: "لوحة التحكم",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "الموظفين",
      href: "/employees",
      icon: Users,
    },
    {
      name: "البراندات",
      href: "/brands",
      icon: ShoppingBag,
    },
    {
      name: "ميديا بايينج",
      href: "/media-buying",
      icon: BarChart3,
    },
    {
      name: "كول سنتر",
      href: "/call-center",
      icon: PhoneCall,
    },
    {
      name: "كتابة المحتوى",
      href: "/content",
      icon: FileEdit,
    },
    {
      name: "التصميم",
      href: "/design",
      icon: PenTool,
    },
    {
      name: "موديريشن",
      href: "/moderation",
      icon: MessageSquare,
    },
    {
      name: "المالية",
      href: "/finance",
      icon: CreditCard,
    },
    {
      name: "الإعدادات",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="bg-white w-64 border-l flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-green-600">Ecomistry</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-green-600",
                  location.pathname === item.href &&
                    "bg-green-50 text-green-600 font-medium"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
