import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/shared/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageUploader } from '@/components/shared/ImageUploader';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/hooks/useAdminProfile';
import { Save, Globe, Phone, Mail, Share2, Settings, Image, Layout } from 'lucide-react';

const settingGroups = [
  { key: 'topbar', label: 'Top Bar', icon: Layout },
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
  const [activeGroup, setActiveGroup] = useState('topbar');
  const [values, setValues] = useState<Record<string, string>>({});
  const [initialized, setInitialized] = useState(false);

  // Load ALL settings once — filter client-side for instant tab switching
  const { data: allSettings = [], isLoading } = useQuery({
    queryKey: ['website_settings_all'],
    queryFn: async () => {
      const { data } = await supabase.from('website_settings').select('*');
      return (data ?? []) as Setting[];
    },
    staleTime: 30 * 1000,
  });

  // Initialise values map from all settings (once loaded)
  useEffect(() => {
    if (allSettings.length > 0 && !initialized) {
      const map: Record<string, string> = {};
      allSettings.forEach((s: Setting) => { map[s.key] = s.value; });
      setValues(map);
      setInitialized(true);
    }
  }, [allSettings, initialized]);

  // Settings visible in the active tab
  const settings = allSettings.filter((s: Setting) => s.setting_group === activeGroup);

  // Detect if a setting is a boolean toggle
  const isBoolKey = (key: string) => {
    const dbVal = allSettings.find(s => s.key === key)?.value ?? '';
    return dbVal === 'true' || dbVal === 'false';
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      // Only save keys belonging to the active group
      const groupKeys = settings.map(s => s.key);
      const updates = groupKeys.map(key =>
        supabase.from('website_settings').update({ value: values[key] ?? '' }).eq('key', key)
      );
      await Promise.all(updates);
      await logActivity('Updated website settings', 'Settings', activeGroup);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website_settings_all'] });
      queryClient.invalidateQueries({ queryKey: ['topbar_settings'] });
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
            onClick={() => setActiveGroup(key)}
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
          <div className="space-y-5">
            {activeGroup === 'topbar' && (
              <div className="bg-muted/30 rounded-xl p-4 border border-border mb-2">
                <p className="font-serif text-xs text-muted-foreground">
                  These settings control what appears in the red top bar of your website. Changes are reflected immediately on the live site.
                </p>
              </div>
            )}
            {settings.map((s: Setting) => {
              const isBool = isBoolKey(s.key);
              const currentVal = values[s.key] ?? s.value;

              if (activeGroup === 'church' && s.key === 'general_overseer_photo') {
                return (
                  <div key={s.key}>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <Label htmlFor={s.key} className="font-serif text-sm font-semibold">{s.label}</Label>
                      </div>
                    </div>
                    <ImageUploader
                      value={currentVal}
                      onChange={url => setValues(v => ({ ...v, [s.key]: url }))}
                      folder="leadership"
                      label="General Overseer Photo"
                    />
                  </div>
                );
              }

              return (
                <div key={s.key}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <Label htmlFor={s.key} className="font-serif text-sm font-semibold">{s.label}</Label>
                      {isBool && (
                        <p className="text-[10px] text-muted-foreground font-serif mt-0.5">Toggle on or off</p>
                      )}
                    </div>
                    {isBool && (
                      <Switch
                        checked={currentVal === 'true'}
                        onCheckedChange={v => setValues(val => ({ ...val, [s.key]: v ? 'true' : 'false' }))}
                      />
                    )}
                  </div>
                  {!isBool && (
                    currentVal.length > 100 ? (
                      <Textarea
                        id={s.key}
                        value={currentVal}
                        onChange={e => setValues(v => ({ ...v, [s.key]: e.target.value }))}
                        className="mt-1.5 font-serif text-sm min-h-20"
                      />
                    ) : (
                      <Input
                        id={s.key}
                        value={currentVal}
                        onChange={e => setValues(v => ({ ...v, [s.key]: e.target.value }))}
                        className="mt-1.5 font-serif"
                      />
                    )
                  )}
                </div>
              );
            })}
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
