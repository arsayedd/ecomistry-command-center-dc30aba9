
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CustomHeader() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (!error && data) {
          setUserData(data);
        }
      }
    };
    
    fetchUserData();
  }, [user]);
  
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <header className="bg-white border-b py-2 px-4">
      <div className="flex justify-between items-center">
        <div className="w-1/3">
          <div className="relative">
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="البحث..."
              className="pr-8 w-full max-w-xs"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{userData?.full_name || user?.email}</p>
              <p className="text-xs text-gray-500">{userData?.department ? `قسم ${userData.department}` : "مستخدم"}</p>
            </div>
            <Avatar>
              <AvatarFallback className="bg-green-100 text-green-600">
                {getInitials(userData?.full_name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
