
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Brand pages
import BrandsPage from "./pages/brands/index";
import AddBrandPage from "./pages/brands/add";
import EditBrandPage from "./pages/brands/[id]/edit";

// Media Buying pages
import MediaBuyingPage from "./pages/media-buying/index";

// Call Center pages
import CallCenterPage from "./pages/call-center/index";

// Moderation pages
import ModerationPage from "./pages/moderation/index";

// Design pages
import DesignPage from "./pages/design/index";

// Finance pages
import FinancePage from "./pages/finance/index";
import AddExpensePage from "./pages/finance/expenses/add";

// Database page
import DatabasePage from "./pages/database/index";

// Settings page
import SettingsPage from "./pages/settings/index";

// Create Home page to redirect users
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route index element={<Login />} />
            </Route>
            
            {/* App Routes */}
            <Route path="/" element={<AppLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Brand Routes */}
              <Route path="brands" element={<BrandsPage />} />
              <Route path="brands/add" element={<AddBrandPage />} />
              <Route path="brands/:id/edit" element={<EditBrandPage />} />
              
              {/* Media Buying Routes */}
              <Route path="media-buying" element={<MediaBuyingPage />} />
              
              {/* Call Center Routes */}
              <Route path="call-center" element={<CallCenterPage />} />
              
              {/* Moderation Routes */}
              <Route path="moderation" element={<ModerationPage />} />
              
              {/* Design Routes */}
              <Route path="design" element={<DesignPage />} />
              
              {/* Finance Routes */}
              <Route path="finance" element={<FinancePage />} />
              <Route path="finance/expenses/add" element={<AddExpensePage />} />
              
              {/* Database Routes */}
              <Route path="database" element={<DatabasePage />} />
              
              {/* Settings Routes */}
              <Route path="settings" element={<SettingsPage />} />
              
              <Route index element={<Navigate to="/dashboard" replace />} />
            </Route>
            
            {/* Root Route */}
            <Route path="/" element={<Index />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
