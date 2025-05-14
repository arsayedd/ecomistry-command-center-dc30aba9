
import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  timeframe?: string;
  className?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  change,
  timeframe = "vs last period",
  className,
}: StatsCardProps) {
  const isPositiveChange = change && change > 0;
  
  return (
    <div className={cn("ecomistry-stat-card", className)}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        {icon && <div className="text-ecomistry-primary">{icon}</div>}
      </div>
      
      {typeof change !== "undefined" && (
        <div className="flex items-center mt-3">
          <div
            className={cn(
              "flex items-center text-sm",
              isPositiveChange ? "text-ecomistry-primary" : "text-ecomistry-error"
            )}
          >
            {isPositiveChange ? (
              <ArrowUpRight size={16} className="mr-1" />
            ) : (
              <ArrowDownRight size={16} className="mr-1" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
          <span className="text-xs text-gray-500 ml-2">{timeframe}</span>
        </div>
      )}
    </div>
  );
}
