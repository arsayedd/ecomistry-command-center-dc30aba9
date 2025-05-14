
import React, { useState } from "react";
import { Bell, Settings, User, ChevronDown, Search, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [notificationCount, setNotificationCount] = useState(3);
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          {/* Mobile menu button can go here */}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ecomistry-primary focus:border-transparent w-full md:w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 bg-ecomistry-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100">
              <div className="w-8 h-8 rounded-full bg-ecomistry-primary flex items-center justify-center text-white">
                <User size={18} />
              </div>
              <span className="hidden md:inline-block">{user?.user_metadata?.full_name || "مستخدم"}</span>
              <ChevronDown size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>حسابي</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="/profile" className="flex items-center gap-2 w-full">
                <User size={16} />
                <span>الملف الشخصي</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/settings" className="flex items-center gap-2 w-full">
                <Settings size={16} />
                <span>الإعدادات</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button 
                className="flex items-center gap-2 w-full text-ecomistry-error"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>تسجيل الخروج</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
