
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CustomSidebar } from '@/components/layout/CustomSidebar';
import { CustomHeader } from '@/components/layout/CustomHeader';

const AppLayout = () => {
  const { user, loading } = useAuth();

  console.log("AppLayout: User:", user ? "Authenticated" : "Not authenticated", "Loading:", loading);

  // If still loading, show a loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login page
  if (!user) {
    console.log("AppLayout: No user, redirecting to login");
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-[#FAF9F5]">
      <div className="flex h-screen overflow-hidden">
        <CustomSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <CustomHeader />
          <main className="flex-1 overflow-y-auto p-4 bg-[#FAF9F5]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
