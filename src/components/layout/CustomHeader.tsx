
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

export const CustomHeader = () => {
  const { user } = useAuth();

  return (
    <header className="bg-background border-b border-border h-16 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <img 
          src="https://i.postimg.cc/MKhxbvS0/00eab832-4bc4-4519-8510-2a386cf7663d.png" 
          alt="Logo" 
          className="h-8 w-auto mr-4"
        />
        <h1 className="text-xl font-bold">إيكوميستري</h1>
      </div>
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <ThemeToggle />
        {user && (
          <div className="text-sm font-medium">
            مرحباً, {user.user_metadata?.full_name || user.email}
          </div>
        )}
      </div>
    </header>
  );
}
