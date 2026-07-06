import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/shared/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/hooks/useAdminProfile';
import { Save, Globe, Phone, Mail, Share2, Settings, Image } from 'lucide-react';

const settingGroups = [
  { key: 'general', label: 'General', icon: Settings },
  { key: 'church', label: 'Church Info', icon: Globe },
  { key: 'footer', label: 'Footer', icon: Globe },
  { key: 'seo', label: 'SEO & Analytics', icon: Globe },
  { key: 'contact', label: 'Contact', icon: Phone },
  { key: 'social', label: 'Social Media', icon: Share2 },
  { key: 'media', label: 'Media', icon: Image },
];

interface Setting {
  id: string;
  key: string;
  value: string;
  label: string;
  setting_group: string;
}

function WebsiteSettingsInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeGroup, setActiveGroup] = useState('general');
  const [values, setValues] = useState<Record<string, string>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['website_settings'],
    queryFn: async () => {
      const { data } = await supabase.from('website_settings').select('*').eq('setting_group', activeGroup);
      return (data ?? []) as Setting[];
    },
  });

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      settings.forEach((s: Setting) => { map[s.key] = s.value; });
      setValues(map);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const updates = Object.entries(values).map(([key, value]) =>
        supabase.from('website_settings').update({ value }).eq('key', key)
      );
      await Promise.all(updates);
      await logActivity('Updated website settings', 'Settings', activeGroup);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website_settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings_all'] });
      toast({ title: 'Settings saved successfully!' });
    },
    onError: () => toast({ title: 'Failed to save settings', variant: 'destructive' }),
  });

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Website Settings</h1>
        <p className="text-muted-foreground font-serif text-sm">Configure your website appearance, SEO, and contact details.</p>
      </div>

      {/* Group tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {settingGroups.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setActiveGroup(key); setValues({}); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif font-semibold transition-all ${
              activeGroup === key ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-card p-6">
        {isLoading ? (
          <div className="space-y-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-14 rounded-lg" />)}</div>
        ) : (
          <div className="space-y-4">
            {settings?.map((s: Setting) => (
              <div key={s.key}>
                <Label htmlFor={s.key} className="font-serif text-sm font-semibold">{s.label}</Label>
                {s.value.length > 80 ? (
                  <Textarea
                    id={s.key}
                    value={values[s.key] ?? s.value}
                    onChange={e => setValues(v => ({ ...v, [s.key]: e.target.value }))}
                    className="mt-1.5 font-serif text-sm min-h-20"
                  />
                ) : (
                  <Input
                    id={s.key}
                    value={values[s.key] ?? s.value}
                    onChange={e => setValues(v => ({ ...v, [s.key]: e.target.value }))}
                    className="mt-1.5 font-serif"
                  />
                )}
                <p className="text-[10px] text-muted-foreground font-serif mt-1">Key: {s.key}</p>
              </div>
            ))}
            <div className="pt-2 flex justify-end">
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-primary text-primary-foreground font-serif gap-2">
                <Save className="w-4 h-4" /> {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const WebsiteSettings = () => (
  <AdminGuard>
    <AdminLayout>
      <WebsiteSettingsInner />
    </AdminLayout>
  </AdminGuard>
);

export default WebsiteSettings;
