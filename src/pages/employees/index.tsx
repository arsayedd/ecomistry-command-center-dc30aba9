
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { Download, Edit, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { exportToExcel, exportToPdf } from '@/utils/exportUtils';

const EmployeesPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<User[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('full_name', { ascending: true });
        
        if (error) throw error;
        setEmployees(data || []);
        setFilteredEmployees(data || []);
        
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast.error('حدث خطأ أثناء تحميل بيانات الموظفين');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployees();
  }, []);
  
  useEffect(() => {
    // Apply filters whenever filters or search query changes
    let results = [...employees];
    
    // Apply department filter
    if (departmentFilter !== 'all') {
      results = results.filter(emp => emp.department === departmentFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(emp => emp.status === statusFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(emp => 
        emp.full_name.toLowerCase().includes(query) || 
        emp.email.toLowerCase().includes(query) ||
        (emp.job_title && emp.job_title.toLowerCase().includes(query))
      );
    }
    
    setFilteredEmployees(results);
  }, [employees, departmentFilter, statusFilter, searchQuery]);
  
  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الموظف؟')) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      toast.success('تم حذف الموظف بنجاح');
      
    } catch (error: any) {
      console.error('Error deleting employee:', error);
      toast.error(error.message || 'حدث خطأ أثناء حذف الموظف');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Extract unique departments for filter
  const departments = ['all', ...new Set(employees.map(emp => emp.department).filter(Boolean))];
  
  // Format badge style based on status
  const getStatusBadge = (status?: string) => {
    switch(status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">نشط</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">غير نشط</Badge>;
      case 'trial':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200">تحت التجربة</Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };
  
  // Translate employment type
  const translateEmploymentType = (type?: string) => {
    const typeMap: Record<string, string> = {
      'full_time': 'دوام كامل',
      'part_time': 'دوام جزئي',
      'freelancer': 'فريلانسر',
      'per_piece': 'بالقطعة'
    };
    
    return type ? typeMap[type] || type : '-';
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الموظفين</h1>
        <Button onClick={() => navigate('/employees/add')}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة موظف جديد
        </Button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="بحث باسم أو بريد الموظف..."
              className="pl-10 text-right"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Department Filter */}
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="text-right">
              <SelectValue placeholder="اختر القسم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأقسام</SelectItem>
              {departments.slice(1).map((dept, i) => (
                <SelectItem key={i} value={dept || ''}>
                  {dept || 'غير محدد'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="text-right">
              <SelectValue placeholder="اختر الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="active">نشط</SelectItem>
              <SelectItem value="inactive">غير نشط</SelectItem>
              <SelectItem value="trial">تحت التجربة</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end mb-4">
          <Button
            onClick={() => exportToExcel(filteredEmployees, 'موظفين_إيكوميستري')}
            variant="outline"
            size="sm"
            className="ml-2"
            disabled={isLoading || filteredEmployees.length === 0}
          >
            <Download className="ml-2 h-4 w-4" />
            تصدير Excel
          </Button>
          <Button
            onClick={() => exportToPdf(filteredEmployees, 'موظفين_إيكوميستري')}
            variant="outline"
            size="sm"
            disabled={isLoading || filteredEmployees.length === 0}
          >
            <Download className="ml-2 h-4 w-4" />
            تصدير PDF
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>قائمة الموظفين</CardTitle>
            <CardDescription>
              {filteredEmployees.length} موظف من إجمالي {employees.length} موظف
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center p-6 text-muted-foreground">
                {searchQuery || departmentFilter !== 'all' || statusFilter !== 'all' 
                  ? 'لا توجد نتائج مطابقة للبحث'
                  : 'لا يوجد موظفين حتى الآن'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">الاسم</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>القسم</TableHead>
                      <TableHead>الوظيفة</TableHead>
                      <TableHead>نوع التعاقد</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="text-left">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.full_name}</TableCell>
                        <TableCell className="font-mono text-sm">{employee.email}</TableCell>
                        <TableCell>{employee.department || '-'}</TableCell>
                        <TableCell>{employee.job_title || '-'}</TableCell>
                        <TableCell>{translateEmploymentType(employee.employment_type)}</TableCell>
                        <TableCell>{getStatusBadge(employee.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">خيارات</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>إجراءات</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => navigate(`/employees/${employee.id}/edit`)}>
                                <Edit className="ml-2 h-4 w-4" />
                                تعديل
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDelete(employee.id)}
                              >
                                <Trash2 className="ml-2 h-4 w-4" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeesPage;
