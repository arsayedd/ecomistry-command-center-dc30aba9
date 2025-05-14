
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Archive,
  BarChart3,
  MessageSquare,
  Phone,
  Banknote,
  FileText,
  Settings,
  Menu,
  X,
  Database,
  Palette,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'الرئيسية', icon: <LayoutDashboard size={20} /> },
    { path: '/employees', label: 'الموظفين', icon: <Users size={20} /> },
    { path: '/brands', label: 'البراندات', icon: <Archive size={20} /> },
    { path: '/media-buying', label: 'الميديا بايينج', icon: <BarChart3 size={20} /> },
    { path: '/moderation', label: 'المودريشن', icon: <MessageSquare size={20} /> },
    { path: '/call-center', label: 'الكول سنتر', icon: <Phone size={20} /> },
    { path: '/finance', label: 'النظام المالي', icon: <Banknote size={20} /> },
    { path: '/content', label: 'كتابة المحتوى', icon: <FileText size={20} /> },
    { path: '/design', label: 'التصميم', icon: <Palette size={20} /> },
    { path: '/database', label: 'قاعدة البيانات', icon: <Database size={20} /> },
    { path: '/settings', label: 'الإعدادات', icon: <Settings size={20} /> },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/auth/login');
  };

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        className="z-50 fixed left-4 top-4 block lg:hidden text-white bg-primary rounded-full p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'bg-muted min-h-screen fixed right-0 top-0 bottom-0 w-64 flex-col shadow-lg transition-transform duration-300 z-40 border-l',
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Logo */}
        <div className="flex flex-col items-center justify-center p-6 border-b">
          <img 
            src="https://i.postimg.cc/MKhxbvS0/00eab832-4bc4-4519-8510-2a386cf7663d.png" 
            alt="Company Logo"
            className="h-16 mb-2" 
          />
          <h1 className="text-lg font-semibold">نظام إدارة المنصة</h1>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 overflow-y-auto" dir="rtl">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all hover:bg-accent hover:text-accent-foreground',
                      isActive ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground'
                    )
                  }
                  end={item.path === '/'}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
            
            {/* Logout Button */}
            <li>
              <Button
                variant="ghost"
                className="flex w-full items-center gap-3 px-4 py-2 rounded-md text-sm text-red-600 hover:bg-red-100 hover:text-red-700"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>تسجيل الخروج</span>
              </Button>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 text-center text-xs text-muted-foreground border-t">
          <p>© {new Date().getFullYear()} شركتكم</p>
          <p className="mt-1">نظام إدارة المنصة v1.0</p>
        </div>
      </aside>
    </>
  );
}
