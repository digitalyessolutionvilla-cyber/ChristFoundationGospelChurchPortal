import { lazy, Suspense, ComponentType } from "react";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const About = lazy(() => import("./pages/About"));
const Vision = lazy(() => import("./pages/Vision"));
const Mission = lazy(() => import("./pages/Mission"));
const Locations = lazy(() => import("./pages/Locations"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Testimonies = lazy(() => import("./pages/Testimonies"));
const OnlineRadio = lazy(() => import("./pages/OnlineRadio"));
const WatchLive = lazy(() => import("./pages/WatchLive"));
const YouthMinistry = lazy(() => import("./pages/YouthMinistry"));
const Contact = lazy(() => import("./pages/Contact"));
const Sermons = lazy(() => import("./pages/Sermons"));
const ChurchLeadership = lazy(() => import("./pages/ChurchLeadership"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));

/* Admin pages */
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const EditContent = lazy(() => import("./pages/admin/EditContent"));
const ContentList = lazy(() => import("./pages/admin/ContentList"));
const ManageEvents = lazy(() => import("./pages/admin/ManageEvents"));
const ManageTestimonies = lazy(() => import("./pages/admin/ManageTestimonies"));
const AdminSermons = lazy(() => import("./pages/admin/Sermons"));
const Leadership = lazy(() => import("./pages/admin/Leadership"));
const Gallery = lazy(() => import("./pages/admin/Gallery"));
const News = lazy(() => import("./pages/admin/News"));
const Branches = lazy(() => import("./pages/admin/Branches"));
const Slider = lazy(() => import("./pages/admin/Slider"));
const WebsiteSettings = lazy(() => import("./pages/admin/Settings"));
const Users = lazy(() => import("./pages/admin/Users"));
const ActivityLogs = lazy(() => import("./pages/admin/ActivityLogs"));
const MediaLibrary = lazy(() => import("./pages/admin/MediaLibrary"));
const NewsCategories = lazy(() => import("./pages/admin/NewsCategories"));
const MenuManagement = lazy(() => import("./pages/admin/MenuManagement"));
const PageBuilder = lazy(() => import("./pages/admin/PageBuilder"));
const HomeBuilder = lazy(() => import("./pages/admin/HomeBuilder"));
const AdminRadio = lazy(() => import("./pages/admin/MediaSettings").then(m => ({ default: m.AdminRadio })));
const AdminWatchLive = lazy(() => import("./pages/admin/MediaSettings").then(m => ({ default: m.AdminWatchLive })));
const PrayerRequests = lazy(() => import("./pages/admin/Forms").then(m => ({ default: m.PrayerRequests })));
const ContactMessages = lazy(() => import("./pages/admin/Forms").then(m => ({ default: m.ContactMessages })));
const Newsletter = lazy(() => import("./pages/admin/Forms").then(m => ({ default: m.Newsletter })));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Wraps a lazily-loaded page in Suspense so navigating to it only downloads
// that page's own chunk instead of the entire app bundle.
function withSuspense(Component: ComponentType) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

export const routers = [
  { path: "/", name: "home", element: withSuspense(Index) },
  { path: "/about", name: "about", element: withSuspense(About) },
  { path: "/vision", name: "vision", element: withSuspense(Vision) },
  { path: "/mission", name: "mission", element: withSuspense(Mission) },
  { path: "/locations", name: "locations", element: withSuspense(Locations) },
  { path: "/calendar", name: "calendar", element: withSuspense(Calendar) },
  { path: "/testimonies", name: "testimonies", element: withSuspense(Testimonies) },
  { path: "/online-radio", name: "online-radio", element: withSuspense(OnlineRadio) },
  { path: "/watch-live", name: "watch-live", element: withSuspense(WatchLive) },
  { path: "/youth-ministry", name: "youth-ministry", element: withSuspense(YouthMinistry) },
  { path: "/contact", name: "contact", element: withSuspense(Contact) },
  { path: "/sermons", name: "sermons", element: withSuspense(Sermons) },
  { path: "/leadership", name: "leadership", element: withSuspense(ChurchLeadership) },
  { path: "/news", name: "news", element: withSuspense(NewsPage) },
  { path: "/gallery", name: "gallery", element: withSuspense(GalleryPage) },

  /* Admin routes */
  { path: "/admin/login", name: "admin-login", element: withSuspense(AdminLogin) },
  { path: "/admin/dashboard", name: "admin-dashboard", element: withSuspense(AdminDashboard) },
  { path: "/admin/content", name: "admin-content", element: withSuspense(ContentList) },
  { path: "/admin/edit/:key", name: "admin-edit", element: withSuspense(EditContent) },
  { path: "/admin/events", name: "admin-events", element: withSuspense(ManageEvents) },
  { path: "/admin/testimonies", name: "admin-testimonies", element: withSuspense(ManageTestimonies) },
  { path: "/admin/sermons", name: "admin-sermons", element: withSuspense(AdminSermons) },
  { path: "/admin/leadership", name: "admin-leadership", element: withSuspense(Leadership) },
  { path: "/admin/gallery", name: "admin-gallery", element: withSuspense(Gallery) },
  { path: "/admin/news", name: "admin-news", element: withSuspense(News) },
  { path: "/admin/branches", name: "admin-branches", element: withSuspense(Branches) },
  { path: "/admin/slider", name: "admin-slider", element: withSuspense(Slider) },
  { path: "/admin/settings", name: "admin-settings", element: withSuspense(WebsiteSettings) },
  { path: "/admin/users", name: "admin-users", element: withSuspense(Users) },
  { path: "/admin/activity", name: "admin-activity", element: withSuspense(ActivityLogs) },
  { path: "/admin/media", name: "admin-media", element: withSuspense(MediaLibrary) },
  { path: "/admin/categories", name: "admin-categories", element: withSuspense(NewsCategories) },
  { path: "/admin/menus", name: "admin-menus", element: withSuspense(MenuManagement) },
  { path: "/admin/pages", name: "admin-pages", element: withSuspense(PageBuilder) },
  { path: "/admin/homepage", name: "admin-homepage", element: withSuspense(HomeBuilder) },
  { path: "/admin/radio", name: "admin-radio", element: withSuspense(AdminRadio) },
  { path: "/admin/watchlive", name: "admin-watchlive", element: withSuspense(AdminWatchLive) },
  { path: "/admin/forms/prayer", name: "admin-prayer", element: withSuspense(PrayerRequests) },
  { path: "/admin/forms/contact", name: "admin-contact", element: withSuspense(ContactMessages) },
  { path: "/admin/forms/newsletter", name: "admin-newsletter", element: withSuspense(Newsletter) },

  /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
  { path: "*", name: "404", element: withSuspense(NotFound) },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
