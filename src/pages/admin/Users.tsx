import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/shared/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/hooks/useAdminProfile';
import { Shield } from 'lucide-react';

const roleColors: Record<string, string> = {
  super_admin: 'bg-church-red text-primary-foreground',
  website_admin: 'bg-primary text-primary-foreground',
  content_editor: 'bg-secondary text-secondary-foreground',
  media_admin: 'bg-accent/20 text-accent-foreground',
  events_admin: 'bg-secondary text-secondary-foreground',
  livestream_admin: 'bg-secondary text-secondary-foreground',
};

interface AdminProfile {
  id: string; user_id: string; full_name: string;
  role_slug: string; is_active: boolean; created_at: string;
}

interface Role { slug: string; name: string; }

function UsersInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: admins, isLoading } = useQuery({
    queryKey: ['admin_users_list'],
    queryFn: async () => {
      const { data } = await supabase.from('admin_profiles').select('*').order('created_at');
      return (data ?? []) as AdminProfile[];
    },
  });

  const { data: roles } = useQuery({
    queryKey: ['admin_roles_list'],
    queryFn: async () => {
      const { data } = await supabase.from('admin_roles').select('slug, name');
      return (data ?? []) as Role[];
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from('admin_profiles').update({ is_active }).eq('id', id);
      if (error) throw error;
      await logActivity(`${is_active ? 'Activated' : 'Deactivated'} admin user`, 'Users');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_users_list'] });
      toast({ title: 'User status updated' });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role_slug }: { id: string; role_slug: string }) => {
      const { error } = await supabase.from('admin_profiles').update({ role_slug }).eq('id', id);
      if (error) throw error;
      await logActivity('Changed user role', 'Users', role_slug);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_users_list'] });
      toast({ title: 'Role updated' });
    },
  });

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Users</h1>
          <p className="text-muted-foreground font-serif text-sm">Manage administrator accounts and roles.</p>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-secondary/60 rounded-xl border border-border p-4 mb-6 text-sm font-serif text-muted-foreground">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
          <div>
            <p className="font-semibold text-foreground mb-1">How to add new administrators</p>
            <p>Have the new admin register at <strong>/admin/login</strong> using their email and a password. They will appear here once registered. You can then assign their role and activate their account.</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-3">
          {admins?.map((admin) => (
            <div key={admin.id} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-display font-bold text-sm">
                      {admin.full_name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-foreground">{admin.full_name || 'No name'}</p>
                    <Badge className={`text-[10px] mt-1 ${roleColors[admin.role_slug] ?? 'bg-secondary'}`}>
                      {admin.role_slug?.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={admin.is_active}
                      onCheckedChange={v => toggleActiveMutation.mutate({ id: admin.id, is_active: v })}
                      disabled={admin.role_slug === 'super_admin'}
                    />
                    <Label className="font-serif text-xs text-muted-foreground">{admin.is_active ? 'Active' : 'Inactive'}</Label>
                  </div>
                  {admin.role_slug !== 'super_admin' && (
                    <select
                      value={admin.role_slug}
                      onChange={e => updateRoleMutation.mutate({ id: admin.id, role_slug: e.target.value })}
                      className="text-xs font-serif border border-input rounded-md px-2 h-8 bg-background"
                    >
                      {roles?.map((r: Role) => (
                        <option key={r.slug} value={r.slug}>{r.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const Users = () => (
  <AdminGuard>
    <AdminLayout>
      <UsersInner />
    </AdminLayout>
  </AdminGuard>
);

export default Users;
