
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CustomSidebar } from '@/components/layout/CustomSidebar';
import { CustomHeader } from '@/components/layout/CustomHeader';
import { useIsMobile } from '@/hooks/use-mobile';

const AppLayout = () => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();

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
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-[#FAF9F5]">
      <div className="flex h-screen overflow-hidden">
        <CustomSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <CustomHeader />
          <main className="flex-1 overflow-y-auto p-2 md:p-6 bg-[#FAF9F5]">
            <div className={isMobile ? "px-1 py-2 max-w-full" : "container mx-auto px-4"}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
