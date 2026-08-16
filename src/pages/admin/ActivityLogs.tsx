import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/shared/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Clock } from 'lucide-react';

interface ActivityLog {
  id: string;
  action: string;
  section: string;
  details: string;
  user_email: string;
  created_at: string;
}

function ActivityLogsInner() {
  const [search, setSearch] = useState('');

  const { data: logs, isLoading } = useQuery({
    queryKey: ['admin_activity_logs_all'],
    queryFn: async () => {
      const { data } = await supabase.from('admin_activity_logs').select('*').order('created_at', { ascending: false }).limit(200);
      return (data ?? []) as ActivityLog[];
    },
  });

  const filtered = logs?.filter((l) =>
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.section?.toLowerCase().includes(search.toLowerCase()) ||
    l.user_email?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Activity Logs</h1>
        <p className="text-muted-foreground font-serif text-sm">A record of all administrator actions on the CMS.</p>
      </div>

      <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by action, section or user..." className="font-serif mb-4" />

      {isLoading ? (
        <div className="space-y-2">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-serif">No activity recorded yet.</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="divide-y divide-border">
              {filtered.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-serif font-semibold text-foreground">{log.action}</p>
                    <span className="text-xs text-primary font-serif">— {log.section}</span>
                  </div>
                  {log.details && <p className="text-xs text-muted-foreground font-serif">{log.details}</p>}
                  <p className="text-[10px] text-muted-foreground font-serif mt-0.5">
                    {log.user_email} · {format(parseISO(log.created_at), 'MMM d, yyyy — h:mm a')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const ActivityLogs = () => (
  <AdminGuard>
    <AdminLayout>
      <ActivityLogsInner />
    </AdminLayout>
  </AdminGuard>
);

export default ActivityLogs;
