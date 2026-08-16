import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/shared/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/hooks/useAdminProfile';
import { Save, Radio, Tv } from 'lucide-react';
import { useState, useEffect } from 'react';

type SettingsMap = Record<string, string>;

interface SettingRow { key: string; value: string; }

function RadioSettingsInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<SettingsMap>({});

  const { data: settings } = useQuery({
    queryKey: ['radio_settings'],
    queryFn: async () => {
      const { data } = await supabase.from('website_settings').select('key, value').in('key', ['online_radio_url', 'online_radio_active']);
      return (data ?? []) as SettingRow[];
    },
  });

  useEffect(() => {
    if (settings) {
      const map: SettingsMap = {};
      settings.forEach((s: SettingRow) => { map[s.key] = s.value; });
      setValues(map);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(Object.entries(values).map(([key, value]) =>
        supabase.from('website_settings').update({ value }).eq('key', key)
      ));
      await logActivity('Updated radio settings', 'Online Radio');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['radio_settings'] });
      queryClient.invalidateQueries({ queryKey: ['website_settings'] });
      toast({ title: 'Radio settings saved!' });
    },
    onError: () => toast({ title: 'Failed to save', variant: 'destructive' }),
  });

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-church-red/10 flex items-center justify-center">
          <Radio className="w-5 h-5 text-church-red" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Online Radio</h1>
          <p className="text-muted-foreground font-serif text-sm">Configure the online radio stream.</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-card p-6 space-y-4">
        <div>
          <Label className="font-serif text-sm font-semibold">Stream URL</Label>
          <Input
            value={values['online_radio_url'] ?? ''}
            onChange={e => setValues(v => ({ ...v, online_radio_url: e.target.value }))}
            className="mt-1.5 font-serif"
            placeholder="https://your-radio-stream.com/stream"
          />
          <p className="text-xs text-muted-foreground font-serif mt-1">Enter the direct stream URL (e.g., from Zeno.fm, RadioGarden, etc.)</p>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={values['online_radio_active'] === 'true'}
            onCheckedChange={v => setValues(vals => ({ ...vals, online_radio_active: v ? 'true' : 'false' }))}
          />
          <Label className="font-serif text-sm">Radio is live / active</Label>
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-primary text-primary-foreground font-serif gap-2">
            <Save className="w-4 h-4" /> {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function WatchLiveSettingsInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<SettingsMap>({});

  const { data: settings } = useQuery({
    queryKey: ['watchlive_settings'],
    queryFn: async () => {
      const { data } = await supabase.from('website_settings').select('key, value').in('key', ['watch_live_youtube_url', 'watch_live_facebook_url', 'watch_live_active', 'watch_live_offline_message']);
      return (data ?? []) as SettingRow[];
    },
  });

  useEffect(() => {
    if (settings) {
      const map: SettingsMap = {};
      settings.forEach((s: SettingRow) => { map[s.key] = s.value; });
      setValues(map);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(Object.entries(values).map(([key, value]) =>
        supabase.from('website_settings').update({ value }).eq('key', key)
      ));
      await logActivity('Updated Watch Live settings', 'Watch Live');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlive_settings'] });
      toast({ title: 'Watch Live settings saved!' });
    },
    onError: () => toast({ title: 'Failed to save', variant: 'destructive' }),
  });

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Tv className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Watch Us Live</h1>
          <p className="text-muted-foreground font-serif text-sm">Configure live streaming settings.</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-card p-6 space-y-4">
        <div>
          <Label className="font-serif text-sm font-semibold">YouTube Live URL</Label>
          <Input value={values['watch_live_youtube_url'] ?? ''} onChange={e => setValues(v => ({ ...v, watch_live_youtube_url: e.target.value }))} className="mt-1.5 font-serif" placeholder="https://youtube.com/live/..." />
        </div>
        <div>
          <Label className="font-serif text-sm font-semibold">Facebook Live URL</Label>
          <Input value={values['watch_live_facebook_url'] ?? ''} onChange={e => setValues(v => ({ ...v, watch_live_facebook_url: e.target.value }))} className="mt-1.5 font-serif" placeholder="https://facebook.com/..." />
        </div>
        <div>
          <Label className="font-serif text-sm font-semibold">Offline Message</Label>
          <Textarea value={values['watch_live_offline_message'] ?? ''} onChange={e => setValues(v => ({ ...v, watch_live_offline_message: e.target.value }))} className="mt-1.5 font-serif min-h-20" />
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={values['watch_live_active'] === 'true'} onCheckedChange={v => setValues(vals => ({ ...vals, watch_live_active: v ? 'true' : 'false' }))} />
          <Label className="font-serif text-sm">Livestream is currently live</Label>
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-primary text-primary-foreground font-serif gap-2">
            <Save className="w-4 h-4" /> {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export const AdminRadio = () => (
  <AdminGuard>
    <AdminLayout>
      <RadioSettingsInner />
    </AdminLayout>
  </AdminGuard>
);

export const AdminWatchLive = () => (
  <AdminGuard>
    <AdminLayout>
      <WatchLiveSettingsInner />
    </AdminLayout>
  </AdminGuard>
);
