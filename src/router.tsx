import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Vision from "./pages/Vision";
import Mission from "./pages/Mission";
import Locations from "./pages/Locations";
import Calendar from "./pages/Calendar";
import Testimonies from "./pages/Testimonies";
import OnlineRadio from "./pages/OnlineRadio";
import WatchLive from "./pages/WatchLive";
import YouthMinistry from "./pages/YouthMinistry";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import EditContent from "./pages/admin/EditContent";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageTestimonies from "./pages/admin/ManageTestimonies";

export const routers = [
  { path: "/", name: "home", element: <Index /> },
  { path: "/about", name: "about", element: <About /> },
  { path: "/vision", name: "vision", element: <Vision /> },
  { path: "/mission", name: "mission", element: <Mission /> },
  { path: "/locations", name: "locations", element: <Locations /> },
  { path: "/calendar", name: "calendar", element: <Calendar /> },
  { path: "/testimonies", name: "testimonies", element: <Testimonies /> },
  { path: "/online-radio", name: "online-radio", element: <OnlineRadio /> },
  { path: "/watch-live", name: "watch-live", element: <WatchLive /> },
  { path: "/youth-ministry", name: "youth-ministry", element: <YouthMinistry /> },
  /* Admin routes */
  { path: "/admin/login", name: "admin-login", element: <AdminLogin /> },
  { path: "/admin/dashboard", name: "admin-dashboard", element: <AdminDashboard /> },
  { path: "/admin/edit/:key", name: "admin-edit", element: <EditContent /> },
  { path: "/admin/events", name: "admin-events", element: <ManageEvents /> },
  { path: "/admin/testimonies", name: "admin-testimonies", element: <ManageTestimonies /> },
  /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
  { path: "*", name: "404", element: <NotFound /> },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
