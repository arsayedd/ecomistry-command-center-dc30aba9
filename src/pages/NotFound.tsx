
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F5]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-green-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">الصفحة غير موجودة</h2>
        <p className="text-gray-600 mb-8">عذراً، الصفحة التي تبحث عنها غير متوفرة</p>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:space-x-reverse">
          <Button asChild>
            <Link to="/dashboard">العودة إلى لوحة التحكم</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">العودة إلى الصفحة الرئيسية</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
