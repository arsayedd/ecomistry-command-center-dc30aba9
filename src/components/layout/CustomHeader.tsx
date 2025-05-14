
import React, { useState, useEffect } from 'react';
import { MoonIcon, SunIcon, BellIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLocation } from 'react-router-dom';
import { getPageTitle } from '@/utils/navigation';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function CustomHeader() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  const onThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    // In a real implementation, this would toggle the theme
  };

  return (
    <header className="h-16 border-b flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <img 
          src="https://i.postimg.cc/MKhxbvS0/00eab832-4bc4-4519-8510-2a386cf7663d.png" 
          alt="Company Logo"
          className="h-10 hidden sm:block" 
        />
        <h1 className="text-xl font-semibold">{getPageTitle(location.pathname)}</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={onThemeToggle}>
          {isDarkMode ? <SunIcon className="h-[1.2rem] w-[1.2rem]" /> : <MoonIcon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <BellIcon className="h-[1.2rem] w-[1.2rem]" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px]">
            <div className="p-3 border-b">
              <h3 className="font-semibold">الإشعارات</h3>
            </div>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1 w-full">
                <p className="font-medium">طلب جديد من براند الزيتون</p>
                <p className="text-sm text-muted-foreground">قبل 10 دقائق</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1 w-full">
                <p className="font-medium">تنبيه: إنفاق عالي في الإعلانات</p>
                <p className="text-sm text-muted-foreground">قبل 30 دقيقة</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1 w-full">
                <p className="font-medium">تم تعيين موعد تسليم المحتوى</p>
                <p className="text-sm text-muted-foreground">قبل ساعة</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>أ م</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
