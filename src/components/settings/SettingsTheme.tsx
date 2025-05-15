
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CircleCheck } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface SettingsThemeProps {
  onSave: () => void;
}

export function SettingsTheme({ onSave }: SettingsThemeProps) {
  const [selectedColor, setSelectedColor] = useState("primary");
  const { theme } = useTheme();
  
  const colors = [
    { name: "primary", bg: "bg-primary" },
    { name: "blue", bg: "bg-blue-500" },
    { name: "purple", bg: "bg-purple-500" },
    { name: "pink", bg: "bg-pink-500" },
    { name: "orange", bg: "bg-orange-500" }
  ];

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="pb-3">
        <CardTitle>إعدادات المظهر</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>وضع العرض</Label>
          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center dark:border-gray-700">
                <span className="text-4xl">☀️</span>
              </div>
              <span>الوضع الفاتح</span>
            </div>

            <div className="mx-4">
              <ThemeToggle />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 bg-gray-900 border border-gray-700 rounded-lg shadow-sm flex items-center justify-center">
                <span className="text-4xl">🌙</span>
              </div>
              <span>الوضع الداكن</span>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-2">
          <Label>الألوان الرئيسية</Label>
          <div className="grid grid-cols-5 gap-4">
            {colors.map((color) => (
              <div
                key={color.name}
                className={`w-full aspect-square ${color.bg} rounded-lg shadow-sm cursor-pointer ${
                  selectedColor === color.name
                    ? "ring-2 ring-offset-2"
                    : "hover:ring-2 hover:ring-offset-2"
                } ${selectedColor === color.name ? `ring-${color.name === "primary" ? "primary" : color.name + "-500"}` : ""} dark:ring-offset-card`}
                onClick={() => setSelectedColor(color.name)}
              />
            ))}
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button onClick={onSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <CircleCheck className="ml-2 h-4 w-4" />
            حفظ إعدادات المظهر
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
