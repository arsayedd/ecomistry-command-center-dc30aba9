
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthLayout = () => {
  const { user, loading } = useAuth();

  // If still loading, show a loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // If user is already authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
