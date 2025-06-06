import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
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

// Employee pages
import EmployeesPage from "./pages/employees/index";
import AddEmployeePage from "./pages/employees/add";
import EditEmployeePage from "./pages/employees/[id]/edit";

// Call Center pages
import CallCenterPage from "./pages/call-center/index";
import AddOrderPage from "./pages/call-center/orders/add";

// Moderation pages
import ModerationPage from "./pages/moderation/index";
import AddModerationPage from "./pages/moderation/add";

// Content Writing pages
import ContentPage from "./pages/content/index";
import AddContentTaskPage from "./pages/content/add";

// Finance pages
import FinancePage from "./pages/finance/index";
import AddExpensePage from "./pages/finance/expenses/add";
import AddRevenuePage from "./pages/finance/revenues/add";

// Commission pages
import CommissionsPage from "./pages/commissions/index";
import AddCommissionPage from "./pages/commissions/add";

// Database page
import DatabasePage from "./pages/database/index";

// Settings pages
import SettingsPage from "./pages/settings/index";
import UserSettingsPage from "./pages/settings/user/index";

// Create Home page to redirect users
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
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
                
                {/* Employees Routes */}
                <Route path="employees" element={<EmployeesPage />} />
                <Route path="employees/add" element={<AddEmployeePage />} />
                <Route path="employees/:id/edit" element={<EditEmployeePage />} />
                
                {/* Call Center Routes */}
                <Route path="call-center" element={<CallCenterPage />} />
                <Route path="call-center/orders/add" element={<AddOrderPage />} />
                
                {/* Moderation Routes */}
                <Route path="moderation" element={<ModerationPage />} />
                <Route path="moderation/add" element={<AddModerationPage />} />
                
                {/* Content Routes */}
                <Route path="content" element={<ContentPage />} />
                <Route path="content/add" element={<AddContentTaskPage />} />
                
                {/* Finance Routes */}
                <Route path="finance" element={<FinancePage />} />
                <Route path="finance/expenses/add" element={<AddExpensePage />} />
                <Route path="finance/revenues/add" element={<AddRevenuePage />} />
                
                {/* Commissions Routes */}
                <Route path="commissions" element={<CommissionsPage />} />
                <Route path="commissions/add" element={<AddCommissionPage />} />
                
                {/* Database Routes */}
                <Route path="database" element={<DatabasePage />} />
                
                {/* Settings Routes */}
                <Route path="settings" element={<SettingsPage />} />
                <Route path="settings/user" element={<UserSettingsPage />} />
                
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
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
