import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import Index from "./pages/Index";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCases from "./pages/admin/Cases";
import AdminCaseDetail from "./pages/admin/CaseDetail";
import Application from "./pages/Application";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/application" element={<Application />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/cases" element={<AdminCases />} />
                <Route path="/admin/cases/:id" element={<AdminCaseDetail />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
