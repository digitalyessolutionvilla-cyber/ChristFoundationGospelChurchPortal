import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { AdminGuard } from '@/components/shared/AdminGuard';
import {
  BookOpen,
  Eye,
  Target,
  Scroll,
  Users,
  CalendarDays,
  MessageSquareQuote,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const LOGO_URL = 'https://cdn.enter.pro/resources/uid_100066245/29b71ed7-ea27-47.png';

const contentItems = [
  { key: 'welcome_message', label: 'Welcome Message', desc: 'Homepage welcome & overseer message', icon: BookOpen },
  { key: 'history_text', label: 'Brief History of the Church', desc: 'Church history section', icon: Scroll },
  { key: 'vision_text', label: 'Our Vision', desc: 'Vision statement', icon: Eye },
  { key: 'mission_text', label: 'Our Mission', desc: 'Mission statement', icon: Target },
  { key: 'motto_text', label: 'Our Motto', desc: 'Church motto', icon: BookOpen },
  { key: 'doctrines_text', label: 'Doctrines and Beliefs', desc: 'Church doctrines & beliefs', icon: BookOpen },
  { key: 'youth_ministry_text', label: 'Youth Ministry', desc: 'Youth ministry description', icon: Users },
];

function AdminDashboardInner() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="bg-primary shadow-blue sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="CFGC" className="h-8 w-8 rounded-full bg-white/10" crossOrigin="anonymous" />
            <span className="font-display font-bold text-primary-foreground text-sm">CFGC Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-primary-foreground/70 hover:text-accent text-xs font-serif transition-colors">
              View Site
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 gap-1.5 font-serif"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary">
            Content Management
          </h1>
          <p className="text-muted-foreground font-serif text-sm mt-1">
            Edit website content, manage events, and review testimonies.
          </p>
        </div>

        {/* Content sections */}
        <section className="mb-10">
          <h2 className="font-display font-semibold text-lg text-foreground mb-4">Page Content</h2>
          <div className="space-y-2">
            {contentItems.map(({ key, label, desc, icon: Icon }) => (
              <Link
                key={key}
                to={`/admin/edit/${key}`}
                className="flex items-center justify-between bg-card rounded-xl border border-border p-4 hover:border-primary/40 hover:shadow-card transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground font-serif">{desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        {/* Events & Testimonies */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/events"
            className="flex items-center justify-between bg-card rounded-xl border border-border p-5 hover:border-primary/40 hover:shadow-card transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-church-gold-dark" />
              </div>
              <div>
                <p className="font-display font-semibold text-foreground">Manage Events</p>
                <p className="text-xs text-muted-foreground font-serif">Add, edit & delete calendar events</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>

          <Link
            to="/admin/testimonies"
            className="flex items-center justify-between bg-card rounded-xl border border-border p-5 hover:border-primary/40 hover:shadow-card transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-church-red/10 flex items-center justify-center">
                <MessageSquareQuote className="w-5 h-5 text-church-red" />
              </div>
              <div>
                <p className="font-display font-semibold text-foreground">Manage Testimonies</p>
                <p className="text-xs text-muted-foreground font-serif">Approve or reject submissions</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </section>
      </main>
    </div>
  );
}

const AdminDashboard = () => (
  <AdminGuard>
    <AdminDashboardInner />
  </AdminGuard>
);

export default AdminDashboard;
