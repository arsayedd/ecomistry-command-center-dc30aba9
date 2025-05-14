
/**
 * Get page title based on the current path
 */
export function getPageTitle(pathname: string): string {
  const routes: Record<string, string> = {
    "/dashboard": "لوحة التحكم",
    "/brands": "إدارة البراندات",
    "/brands/add": "إضافة براند جديد",
    "/employees": "إدارة الموظفين",
    "/employees/add": "إضافة موظف جديد",
    "/media-buying": "ميديا بايينج",
    "/media-buying/add": "إضافة حملة إعلانية",
    "/call-center": "كول سنتر",
    "/call-center/orders/add": "إضافة أوردر جديد",
    "/moderation": "المودريشن",
    "/moderation/add": "إضافة تقرير جديد",
    "/content": "كتابة المحتوى",
    "/content/add": "إضافة مهمة جديدة",
    "/finance": "النظام المالي",
    "/finance/expenses/add": "إضافة مصروف جديد",
    "/finance/revenues/add": "إضافة إيراد جديد",
    "/commissions": "العمولات",
    "/commissions/add": "إضافة عمولة جديدة",
    "/database": "قاعدة البيانات",
    "/settings": "الإعدادات",
  };

  // Check if the path without its ID part is in our routes
  // Example: /brands/123/edit should match /brands/edit
  const editRoute = Object.keys(routes).find(route => {
    if (pathname.includes('/edit')) {
      const baseRoute = pathname.split('/').slice(0, -2).join('/');
      return route === baseRoute + '/edit';
    }
    return false;
  });

  if (editRoute) {
    return routes[editRoute];
  }

  // Exact match
  if (routes[pathname]) {
    return routes[pathname];
  }

  // Default
  return "لوحة التحكم";
}
