
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F5]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-green-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">الصفحة غير موجودة</h2>
        <p className="text-gray-600 mb-8">عذراً، الصفحة التي تبحث عنها غير متوفرة</p>
        <Button asChild>
          <Link to="/dashboard">العودة إلى لوحة التحكم</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
