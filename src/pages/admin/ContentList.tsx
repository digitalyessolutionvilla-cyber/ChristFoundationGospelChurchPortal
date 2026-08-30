import { AdminGuard } from '@/components/shared/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Link } from 'react-router-dom';
import { ChevronRight, FileText, Eye, Target, BookOpen, Scroll, Users } from 'lucide-react';

const contentItems = [
  { key: 'welcome_message', label: 'Welcome Message', desc: 'Homepage welcome & overseer message', icon: FileText },
  { key: 'sunday_school_lesson', label: 'Sunday School Lesson', desc: 'Date, topic, and memory verse in English & Yoruba', icon: BookOpen },
  { key: 'history_text', label: 'Brief History of the Church', desc: 'Church history section on About page', icon: Scroll },
  { key: 'vision_text', label: 'Our Vision', desc: 'Vision statement', icon: Eye },
  { key: 'mission_text', label: 'Our Mission', desc: 'Mission statement', icon: Target },
  { key: 'motto_text', label: 'Our Motto', desc: 'Church motto', icon: BookOpen },
  { key: 'doctrines_text', label: 'Doctrines and Beliefs', desc: 'Church doctrines & beliefs page', icon: BookOpen },
  { key: 'youth_ministry_text', label: 'Youth Ministry', desc: 'Youth ministry description', icon: Users },
];

function ContentListInner() {
  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Page Content</h1>
        <p className="text-muted-foreground font-serif text-sm">Edit text content displayed on the public website.</p>
      </div>
      <div className="space-y-2">
        {contentItems.map(({ key, label, desc, icon: Icon }) => (
          <Link
            key={key}
            to={`/admin/edit/${key}`}
            className="flex items-center justify-between bg-card rounded-xl border border-border p-4 hover:border-primary/40 hover:shadow-card transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
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
    </div>
  );
}

const ContentList = () => (
  <AdminGuard>
    <AdminLayout>
      <ContentListInner />
    </AdminLayout>
  </AdminGuard>
);

export default ContentList;
