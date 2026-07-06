import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/shared/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/hooks/useAdminProfile';
import { Check, Trash2, HandHeart, Mail, Rss, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface PrayerRequest {
  id: string; full_name: string; email: string; phone: string;
  request: string; is_private: boolean; is_responded: boolean; created_at: string;
}

interface ContactMessage {
  id: string; full_name: string; email: string; phone: string;
  subject: string; message: string; is_read: boolean; created_at: string;
}

interface Subscriber {
  id: string; email: string; full_name: string; is_active: boolean; subscribed_at: string;
}

function PrayerRequestsInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin_prayer_requests'],
    queryFn: async () => {
      const { data } = await supabase.from('prayer_requests').select('*').order('created_at', { ascending: false });
      return (data ?? []) as PrayerRequest[];
    },
  });

  const markResponded = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('prayer_requests').update({ is_responded: true }).eq('id', id);
      await logActivity('Responded to prayer request', 'Prayer Requests');
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin_prayer_requests'] }); toast({ title: 'Marked as responded' }); },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => { await supabase.from('prayer_requests').delete().eq('id', id); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin_prayer_requests'] }); toast({ title: 'Deleted' }); },
  });

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-church-red/10 flex items-center justify-center"><HandHeart className="w-5 h-5 text-church-red" /></div>
        <div><h1 className="font-display text-2xl font-bold text-foreground">Prayer Requests</h1><p className="text-muted-foreground font-serif text-sm">{data?.filter((r) => !r.is_responded).length ?? 0} pending responses</p></div>
      </div>
      {isLoading ? <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}</div> : (
        <div className="space-y-3">
          {data?.map((r) => (
            <div key={r.id} className={`bg-card rounded-xl border p-4 ${r.is_responded ? 'border-border opacity-70' : 'border-church-red/20'}`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-display font-semibold text-sm text-foreground">{r.full_name}</span>
                  {r.email && <span className="text-xs text-muted-foreground font-serif">{r.email}</span>}
                  {r.is_private && <Badge variant="secondary" className="text-[10px]">Private</Badge>}
                  {r.is_responded && <Badge className="text-[10px] bg-primary/10 text-primary">Responded</Badge>}
                </div>
                <div className="flex gap-2 shrink-0">
                  {!r.is_responded && <Button size="sm" onClick={() => markResponded.mutate(r.id)} className="bg-primary text-primary-foreground h-7 text-xs gap-1"><Check className="w-3 h-3" /> Responded</Button>}
                  <Button size="sm" variant="outline" onClick={() => deleteItem.mutate(r.id)} className="h-7 text-destructive border-destructive/30"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
              <p className="text-sm font-serif text-foreground/80 leading-relaxed">{r.request}</p>
              <p className="text-[10px] text-muted-foreground font-serif mt-2">{format(parseISO(r.created_at), 'MMM d, yyyy — h:mm a')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContactMessagesInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin_contact_messages'],
    queryFn: async () => {
      const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      return (data ?? []) as ContactMessage[];
    },
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => { await supabase.from('contact_messages').update({ is_read: true }).eq('id', id); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin_contact_messages'] }); toast({ title: 'Marked as read' }); },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => { await supabase.from('contact_messages').delete().eq('id', id); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin_contact_messages'] }); toast({ title: 'Deleted' }); },
  });

  const filtered = data?.filter((m) =>
    m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.subject?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Mail className="w-5 h-5 text-primary" /></div>
        <div><h1 className="font-display text-2xl font-bold text-foreground">Contact Messages</h1><p className="text-muted-foreground font-serif text-sm">{data?.filter((m) => !m.is_read).length ?? 0} unread messages</p></div>
      </div>
      <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." className="font-serif mb-4" />
      {isLoading ? <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}</div> : (
        <div className="space-y-2">
          {filtered.map((m) => (
            <div key={m.id} className={`bg-card rounded-xl border p-4 ${m.is_read ? 'border-border' : 'border-primary/30'}`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-sm text-foreground">{m.full_name}</span>
                    {!m.is_read && <Badge className="text-[10px] bg-church-red text-primary-foreground">New</Badge>}
                  </div>
                  <p className="text-xs text-primary font-serif">{m.email} {m.phone && `· ${m.phone}`}</p>
                  {m.subject && <p className="text-xs font-semibold text-foreground font-serif mt-0.5">Subject: {m.subject}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  {!m.is_read && <Button size="sm" onClick={() => markRead.mutate(m.id)} variant="outline" className="h-7 text-xs font-serif"><Check className="w-3 h-3 mr-1" /> Read</Button>}
                  <Button size="sm" variant="outline" onClick={() => deleteItem.mutate(m.id)} className="h-7 text-destructive border-destructive/30"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
              <p className="text-sm font-serif text-foreground/80 leading-relaxed">{m.message}</p>
              <p className="text-[10px] text-muted-foreground font-serif mt-2">{format(parseISO(m.created_at), 'MMM d, yyyy — h:mm a')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NewsletterInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin_newsletter'],
    queryFn: async () => {
      const { data } = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false });
      return (data ?? []) as Subscriber[];
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      await supabase.from('newsletter_subscribers').update({ is_active }).eq('id', id);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin_newsletter'] }); toast({ title: 'Subscriber updated' }); },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => { await supabase.from('newsletter_subscribers').delete().eq('id', id); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin_newsletter'] }); toast({ title: 'Subscriber removed' }); },
  });

  const active = data?.filter((s) => s.is_active).length ?? 0;

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"><Rss className="w-5 h-5 text-secondary-foreground" /></div>
        <div><h1 className="font-display text-2xl font-bold text-foreground">Newsletter Subscribers</h1><p className="text-muted-foreground font-serif text-sm">{active} active subscribers</p></div>
      </div>
      {isLoading ? <div className="space-y-2">{[1,2,3,4].map(i => <Skeleton key={i} className="h-12 rounded-xl" />)}</div> : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {data?.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-sm font-serif font-medium text-foreground">{s.email}</p>
                  {s.full_name && <p className="text-xs text-muted-foreground font-serif">{s.full_name}</p>}
                  <p className="text-[10px] text-muted-foreground font-serif">{format(parseISO(s.subscribed_at), 'MMM d, yyyy')}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Badge variant={s.is_active ? 'default' : 'secondary'} className={`text-[10px] cursor-pointer ${s.is_active ? 'bg-primary text-primary-foreground' : ''}`} onClick={() => toggleActive.mutate({ id: s.id, is_active: !s.is_active })}>
                    {s.is_active ? 'Active' : 'Unsubscribed'}
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={() => deleteItem.mutate(s.id)} className="h-7 text-destructive hover:bg-destructive/10 p-1.5"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const PrayerRequests = () => (
  <AdminGuard>
    <AdminLayout>
      <PrayerRequestsInner />
    </AdminLayout>
  </AdminGuard>
);

export const ContactMessages = () => (
  <AdminGuard>
    <AdminLayout>
      <ContactMessagesInner />
    </AdminLayout>
  </AdminGuard>
);

export const Newsletter = () => (
  <AdminGuard>
    <AdminLayout>
      <NewsletterInner />
    </AdminLayout>
  </AdminGuard>
);
