
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

// Content pages
import ContentPage from "./pages/content/index";
import AddContentTask from "./pages/content/add";
import ContentTaskDetails from "./pages/content/[id]";
import EditContentTask from "./pages/content/[id]/edit";

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
              
              {/* Content Routes */}
              <Route path="content" element={<ContentPage />} />
              <Route path="content/add" element={<AddContentTask />} />
              <Route path="content/:id" element={<ContentTaskDetails />} />
              <Route path="content/:id/edit" element={<EditContentTask />} />
              
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
