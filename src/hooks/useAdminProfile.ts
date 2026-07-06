import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAdminProfile() {
  return useQuery({
    queryKey: ['admin_profile_me'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;
      const { data } = await supabase
        .from('admin_profiles')
        .select('*, admin_roles(permissions)')
        .eq('user_id', session.user.id)
        .maybeSingle();
      return data;
    },
  });
}

export function usePermission(permission: string): boolean {
  const { data: profile } = useAdminProfile();
  if (!profile) return false;
  if (profile.role_slug === 'super_admin') return true;
  const permissions = (profile as { admin_roles?: { permissions?: Record<string, boolean> } })?.admin_roles?.permissions ?? {};
  return !!permissions[permission];
}

export async function logActivity(action: string, section: string, details?: string) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;
  await supabase.from('admin_activity_logs').insert({
    user_id: session.user.id,
    user_email: session.user.email,
    action,
    section,
    details: details ?? '',
  });
}
