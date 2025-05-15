
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const CustomHeader = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-background border-b border-border h-16 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <img 
          src="https://i.postimg.cc/MKhxbvS0/00eab832-4bc4-4519-8510-2a386cf7663d.png" 
          alt="Logo" 
          className="h-10 w-auto mr-4 filter brightness-110"
        />
        <h1 className="text-xl font-bold text-primary">إيكوميستري</h1>
      </div>
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <ThemeToggle />
        {user && (
          <>
            <div className="text-sm font-medium ml-4">
              مرحباً, {user.user_metadata?.full_name || user.email}
            </div>
            <Button variant="outline" size="sm" onClick={signOut} className="flex items-center gap-2 hover:bg-primary/10">
              <LogOut size={16} />
              <span>تسجيل الخروج</span>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
