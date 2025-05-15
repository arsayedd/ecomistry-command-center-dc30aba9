
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { Toaster } from "@/components/ui/toaster"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light">
      <div>
        <App />
        <Toaster />
      </div>
    </ThemeProvider>
  </StrictMode>
);
