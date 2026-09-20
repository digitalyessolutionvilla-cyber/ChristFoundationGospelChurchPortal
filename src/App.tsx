import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
import { useLayoutEffect, type ReactNode } from "react";
import { routers } from "./router";

const queryClient = new QueryClient();

function ScrollToTop({ children }: { children: ReactNode }) {
  const location = useLocation();

  useLayoutEffect(() => {
    window.history.scrollRestoration = 'manual';

    if (location.hash) {
      requestAnimationFrame(() => {
        document.getElementById(location.hash.slice(1))?.scrollIntoView();
      });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search, location.hash]);

  return children;
}

const App = () => {
  const router = createBrowserRouter(
    routers.map(route => ({
      ...route,
      element: <ScrollToTop>{route.element}</ScrollToTop>,
    })),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
