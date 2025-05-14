
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Employee pages
import EmployeesPage from "./pages/employees/index";
import AddEmployeePage from "./pages/employees/add";
import EmployeeDetailsPage from "./pages/employees/[id]";

// Brand pages
import BrandsPage from "./pages/brands/index";

// Media Buying pages
import MediaBuyingPage from "./pages/media-buying/index";

// Call Center pages
import CallCenterPage from "./pages/call-center/index";

// Content pages
import ContentPage from "./pages/content/index";
import AddContentTask from "./pages/content/add";
import ContentTaskDetails from "./pages/content/[id]";
import EditContentTask from "./pages/content/[id]/edit";

// Moderation pages
import ModerationPage from "./pages/moderation/index";

// Design pages
import DesignPage from "./pages/design/index";

// Revenue pages
import RevenuesPage from "./pages/revenues/index";
import AddRevenuePage from "./pages/revenues/add";

// Finance pages
import FinancePage from "./pages/finance/index";

// Database page
import DatabasePage from "./pages/database/index";

// Settings page
import SettingsPage from "./pages/settings/index";

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
              
              {/* Employee Routes */}
              <Route path="employees" element={<EmployeesPage />} />
              <Route path="employees/add" element={<AddEmployeePage />} />
              <Route path="employees/:id" element={<EmployeeDetailsPage />} />
              
              {/* Brand Routes */}
              <Route path="brands" element={<BrandsPage />} />
              
              {/* Revenue Routes */}
              <Route path="revenues" element={<RevenuesPage />} />
              <Route path="revenues/add" element={<AddRevenuePage />} />
              
              {/* Media Buying Routes */}
              <Route path="media-buying" element={<MediaBuyingPage />} />
              
              {/* Call Center Routes */}
              <Route path="call-center" element={<CallCenterPage />} />
              
              {/* Content Routes */}
              <Route path="content" element={<ContentPage />} />
              <Route path="content/add" element={<AddContentTask />} />
              <Route path="content/:id" element={<ContentTaskDetails />} />
              <Route path="content/:id/edit" element={<EditContentTask />} />
              
              {/* Moderation Routes */}
              <Route path="moderation" element={<ModerationPage />} />
              
              {/* Design Routes */}
              <Route path="design" element={<DesignPage />} />
              
              {/* Finance Routes */}
              <Route path="finance" element={<FinancePage />} />
              
              {/* Database Routes */}
              <Route path="database" element={<DatabasePage />} />
              
              {/* Settings Routes */}
              <Route path="settings" element={<SettingsPage />} />
              
              <Route index element={<Dashboard />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
