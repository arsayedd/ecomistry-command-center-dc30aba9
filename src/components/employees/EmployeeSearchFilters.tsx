
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmployeeSearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterDepartment: string;
  setFilterDepartment: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  filterContractType: string;
  setFilterContractType: (value: string) => void;
}

export default function EmployeeSearchFilters({
  searchQuery,
  setSearchQuery,
  filterDepartment,
  setFilterDepartment,
  filterStatus,
  setFilterStatus,
  filterContractType,
  setFilterContractType,
}: EmployeeSearchFiltersProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">البحث والتصفية</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="بحث بالاسم أو البريد الإلكتروني..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="اختر القسم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع الأقسام</SelectItem>
              <SelectItem value="call-center">كول سنتر</SelectItem>
              <SelectItem value="media-buying">ميديا بايينج</SelectItem>
              <SelectItem value="content">كتابة المحتوى</SelectItem>
              <SelectItem value="design">تصميم</SelectItem>
              <SelectItem value="moderation">موديريشن</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="حالة الموظف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع الحالات</SelectItem>
              <SelectItem value="active">نشط</SelectItem>
              <SelectItem value="inactive">غير نشط</SelectItem>
              <SelectItem value="pending">معلق</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterContractType} onValueChange={setFilterContractType}>
            <SelectTrigger>
              <SelectValue placeholder="نوع التعاقد" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع أنواع التعاقد</SelectItem>
              <SelectItem value="full-time">دوام كامل</SelectItem>
              <SelectItem value="part-time">دوام جزئي</SelectItem>
              <SelectItem value="freelancer">فريلانسر</SelectItem>
              <SelectItem value="per-task">بالقطعة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
