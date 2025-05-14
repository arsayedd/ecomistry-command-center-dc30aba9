
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
  FileText,
  UserCog,
  Briefcase,
  Database,
} from "lucide-react";

export function CustomSidebar() {
  const { signOut } = useAuth();
  const location = useLocation();

  const mainItems = [
    {
      name: "لوحة التحكم",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
  ];

  const managementItems = [
    {
      name: "الموظفين",
      href: "/employees",
      icon: Users,
      subItems: [
        { name: "قائمة الموظفين", href: "/employees" },
        { name: "إضافة موظف", href: "/employees/add" },
        { name: "العمولات", href: "/employees/commissions" },
      ],
    },
    {
      name: "البراندات",
      href: "/brands",
      icon: ShoppingBag,
      subItems: [
        { name: "قائمة البراندات", href: "/brands" },
        { name: "إضافة براند", href: "/brands/add" },
      ],
    },
  ];

  const departmentItems = [
    {
      name: "ميديا بايينج",
      href: "/media-buying",
      icon: BarChart3,
      subItems: [
        { name: "الإحصائيات", href: "/media-buying" },
        { name: "إضافة حملة", href: "/media-buying/add" },
        { name: "التقارير", href: "/media-buying/reports" },
      ],
    },
    {
      name: "كول سنتر",
      href: "/call-center",
      icon: PhoneCall,
      subItems: [
        { name: "الطلبات", href: "/call-center" },
        { name: "إضافة طلب", href: "/call-center/add" },
        { name: "العمولات", href: "/call-center/commissions" },
      ],
    },
    {
      name: "كتابة المحتوى",
      href: "/content",
      icon: FileEdit,
      subItems: [
        { name: "المشاريع", href: "/content" },
        { name: "إضافة مشروع", href: "/content/add" },
        { name: "الفريق", href: "/content/team" },
      ],
    },
    {
      name: "التصميم",
      href: "/design",
      icon: PenTool,
      subItems: [
        { name: "المشاريع", href: "/design" },
        { name: "إضافة مشروع", href: "/design/add" },
        { name: "الفريق", href: "/design/team" },
      ],
    },
    {
      name: "موديريشن",
      href: "/moderation",
      icon: MessageSquare,
      subItems: [
        { name: "التعليقات", href: "/moderation" },
        { name: "الإحصائيات", href: "/moderation/stats" },
        { name: "الفريق", href: "/moderation/team" },
      ],
    },
  ];

  const financeItems = [
    {
      name: "المالية",
      href: "/finance",
      icon: CreditCard,
      subItems: [
        { name: "المصروفات", href: "/finance/expenses" },
        { name: "الإيرادات", href: "/finance/revenue" },
        { name: "التقارير", href: "/finance/reports" },
      ],
    },
  ];

  const systemItems = [
    {
      name: "قاعدة البيانات",
      href: "/database",
      icon: Database,
      subItems: [
        { name: "التصدير", href: "/database/export" },
        { name: "الاستيراد", href: "/database/import" },
      ],
    },
    {
      name: "الإعدادات",
      href: "/settings",
      icon: Settings,
      subItems: [
        { name: "إعدادات عامة", href: "/settings" },
        { name: "صلاحيات المستخدمين", href: "/settings/permissions" },
        { name: "سجل النشاطات", href: "/settings/logs" },
      ],
    },
  ];

  // Check if the current location starts with a specific path
  const isSubPathActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  // Check if a nav item or any of its subitems is active
  const isNavItemActive = (item: any) => {
    if (isSubPathActive(item.href)) return true;
    if (item.subItems) {
      return item.subItems.some((subItem: any) => isSubPathActive(subItem.href));
    }
    return false;
  };

  const renderNavItem = (item: any) => (
    <li key={item.href}>
      <Link
        to={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-green-600",
          isNavItemActive(item) && "bg-green-50 text-green-600 font-medium"
        )}
      >
        <item.icon className="h-5 w-5" />
        <span>{item.name}</span>
      </Link>
    </li>
  );

  const renderNavSection = (title: string, items: any[]) => (
    <div className="mb-6">
      <h2 className="mb-2 px-4 text-xs font-semibold text-gray-400">{title}</h2>
      <ul className="space-y-1 px-2">
        {items.map(renderNavItem)}
      </ul>
    </div>
  );

  return (
    <aside className="bg-white w-64 border-l flex flex-col h-full overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-green-600">Ecomistry</h1>
      </div>
      <nav className="flex-1">
        {renderNavSection("الرئيسية", mainItems)}
        {renderNavSection("إدارة", managementItems)}
        {renderNavSection("الأقسام", departmentItems)}
        {renderNavSection("المالية", financeItems)}
        {renderNavSection("النظام", systemItems)}
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
