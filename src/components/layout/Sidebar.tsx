
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Users,
  TrendingUp,
  PhoneCall,
  MessageSquare,
  PenTool,
  FileText,
  Package,
  DollarSign,
  Database,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
};

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, collapsed, onClick }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 px-3 py-2 rounded-md transition-all",
          isActive
            ? "bg-ecomistry-primary text-white"
            : "hover:bg-ecomistry-accent hover:text-ecomistry-text"
        )
      }
      onClick={onClick}
    >
      <div className="text-lg">{icon}</div>
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
};

type NavGroupProps = {
  title: string;
  children: React.ReactNode;
  collapsed: boolean;
  icon: React.ReactNode;
};

const NavGroup: React.FC<NavGroupProps> = ({ title, children, collapsed, icon }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="mb-4">
      <div 
        className="flex items-center justify-between cursor-pointer px-3 py-2 hover:bg-ecomistry-accent rounded-md transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <div className="text-lg">{icon}</div>
          {!collapsed && <span className="font-semibold">{title}</span>}
        </div>
        {!collapsed && (
          <div>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        )}
      </div>
      
      {(isOpen || collapsed) && <div className="mt-1 ml-2 space-y-1">{children}</div>}
    </div>
  );
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 overflow-y-auto",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-ecomistry-primary">Ecomistry</h1>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-ecomistry-accent transition-colors"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <div className="flex-1 py-4 px-2 space-y-1">
        <NavItem
          to="/dashboard"
          icon={<BarChart3 size={20} />}
          label="Dashboard"
          collapsed={collapsed}
        />
        
        <NavGroup title="Hr Management" icon={<Users size={20} />} collapsed={collapsed}>
          <NavItem
            to="/employees"
            icon={<Users size={20} />}
            label="Employees"
            collapsed={collapsed}
          />
        </NavGroup>
        
        <NavGroup title="Media Buying" icon={<TrendingUp size={20} />} collapsed={collapsed}>
          <NavItem
            to="/media-buying/performance"
            icon={<TrendingUp size={20} />}
            label="Performance"
            collapsed={collapsed}
          />
          <NavItem
            to="/media-buying/campaigns"
            icon={<TrendingUp size={20} />}
            label="Campaigns"
            collapsed={collapsed}
          />
        </NavGroup>
        
        <NavGroup title="Call Center" icon={<PhoneCall size={20} />} collapsed={collapsed}>
          <NavItem
            to="/call-center/orders"
            icon={<PhoneCall size={20} />}
            label="Orders"
            collapsed={collapsed}
          />
          <NavItem
            to="/call-center/commissions"
            icon={<DollarSign size={20} />}
            label="Commissions"
            collapsed={collapsed}
          />
        </NavGroup>
        
        <NavGroup title="Moderation" icon={<MessageSquare size={20} />} collapsed={collapsed}>
          <NavItem
            to="/moderation"
            icon={<MessageSquare size={20} />}
            label="Chat Moderation"
            collapsed={collapsed}
          />
        </NavGroup>
        
        <NavGroup title="Design" icon={<PenTool size={20} />} collapsed={collapsed}>
          <NavItem
            to="/design"
            icon={<PenTool size={20} />}
            label="Design Projects"
            collapsed={collapsed}
          />
        </NavGroup>
        
        <NavGroup title="Content" icon={<FileText size={20} />} collapsed={collapsed}>
          <NavItem
            to="/content"
            icon={<FileText size={20} />}
            label="Content Writing"
            collapsed={collapsed}
          />
        </NavGroup>
        
        <NavGroup title="Brands" icon={<Package size={20} />} collapsed={collapsed}>
          <NavItem
            to="/brands"
            icon={<Package size={20} />}
            label="Brand Management"
            collapsed={collapsed}
          />
        </NavGroup>
        
        <NavGroup title="Finance" icon={<DollarSign size={20} />} collapsed={collapsed}>
          <NavItem
            to="/finance/expenses"
            icon={<DollarSign size={20} />}
            label="Expenses"
            collapsed={collapsed}
          />
          <NavItem
            to="/finance/revenue"
            icon={<DollarSign size={20} />}
            label="Revenue"
            collapsed={collapsed}
          />
          <NavItem
            to="/finance/reports"
            icon={<BarChart3 size={20} />}
            label="Reports"
            collapsed={collapsed}
          />
        </NavGroup>
        
        <NavItem
          to="/database"
          icon={<Database size={20} />}
          label="Database"
          collapsed={collapsed}
        />
        
        <NavItem
          to="/settings"
          icon={<Settings size={20} />}
          label="Settings"
          collapsed={collapsed}
        />
      </div>
    </div>
  );
}
