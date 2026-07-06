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
import Contact from "./pages/Contact";
import Sermons from "./pages/Sermons";
import ChurchLeadership from "./pages/ChurchLeadership";
import NewsPage from "./pages/NewsPage";
import GalleryPage from "./pages/GalleryPage";

/* Admin pages */
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import EditContent from "./pages/admin/EditContent";
import ContentList from "./pages/admin/ContentList";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageTestimonies from "./pages/admin/ManageTestimonies";
import AdminSermons from "./pages/admin/Sermons";
import Leadership from "./pages/admin/Leadership";
import Gallery from "./pages/admin/Gallery";
import News from "./pages/admin/News";
import Branches from "./pages/admin/Branches";
import Slider from "./pages/admin/Slider";
import WebsiteSettings from "./pages/admin/Settings";
import Users from "./pages/admin/Users";
import ActivityLogs from "./pages/admin/ActivityLogs";
import { AdminRadio, AdminWatchLive } from "./pages/admin/MediaSettings";
import { PrayerRequests, ContactMessages, Newsletter } from "./pages/admin/Forms";

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
  { path: "/contact", name: "contact", element: <Contact /> },
  { path: "/sermons", name: "sermons", element: <Sermons /> },
  { path: "/leadership", name: "leadership", element: <ChurchLeadership /> },
  { path: "/news", name: "news", element: <NewsPage /> },
  { path: "/gallery", name: "gallery", element: <GalleryPage /> },

  /* Admin routes */
  { path: "/admin/login", name: "admin-login", element: <AdminLogin /> },
  { path: "/admin/dashboard", name: "admin-dashboard", element: <AdminDashboard /> },
  { path: "/admin/content", name: "admin-content", element: <ContentList /> },
  { path: "/admin/edit/:key", name: "admin-edit", element: <EditContent /> },
  { path: "/admin/events", name: "admin-events", element: <ManageEvents /> },
  { path: "/admin/testimonies", name: "admin-testimonies", element: <ManageTestimonies /> },
  { path: "/admin/sermons", name: "admin-sermons", element: <AdminSermons /> },
  { path: "/admin/leadership", name: "admin-leadership", element: <Leadership /> },
  { path: "/admin/gallery", name: "admin-gallery", element: <Gallery /> },
  { path: "/admin/news", name: "admin-news", element: <News /> },
  { path: "/admin/branches", name: "admin-branches", element: <Branches /> },
  { path: "/admin/slider", name: "admin-slider", element: <Slider /> },
  { path: "/admin/settings", name: "admin-settings", element: <WebsiteSettings /> },
  { path: "/admin/users", name: "admin-users", element: <Users /> },
  { path: "/admin/activity", name: "admin-activity", element: <ActivityLogs /> },
  { path: "/admin/radio", name: "admin-radio", element: <AdminRadio /> },
  { path: "/admin/watchlive", name: "admin-watchlive", element: <AdminWatchLive /> },
  { path: "/admin/forms/prayer", name: "admin-prayer", element: <PrayerRequests /> },
  { path: "/admin/forms/contact", name: "admin-contact", element: <ContactMessages /> },
  { path: "/admin/forms/newsletter", name: "admin-newsletter", element: <Newsletter /> },

  /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
  { path: "*", name: "404", element: <NotFound /> },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
