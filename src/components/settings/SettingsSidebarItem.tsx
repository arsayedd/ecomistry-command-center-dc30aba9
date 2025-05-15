
import { TabsTrigger } from "@/components/ui/tabs";
import React from "react";

interface SettingsSidebarItemProps {
  value: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}

export function SettingsSidebarItem({ value, active, icon, label }: SettingsSidebarItemProps) {
  return (
    <TabsTrigger
      value={value}
      className={`w-full justify-start px-4 py-2 text-right ${
        active ? "bg-primary/10" : ""
      }`}
    >
      {icon}
      {label}
    </TabsTrigger>
  );
}
