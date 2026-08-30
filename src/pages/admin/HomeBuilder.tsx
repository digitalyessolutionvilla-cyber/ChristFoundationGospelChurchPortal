import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/shared/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/hooks/useAdminProfile';
import { ImageUploader } from '@/components/shared/ImageUploader';
import { IconPicker, SelectedIcon } from '@/components/shared/IconPicker';
import { DynamicIcon } from '@/components/shared/DynamicIcon';
import {
  Plus, Trash2, Edit2, Save, ChevronUp, ChevronDown, X,
  GripVertical, Eye, EyeOff, Sliders, Link as LinkIcon, Palette
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────── */
interface HomeSection {
  id: string;
  section_key: string;
  label: string;
  display_order: number;
  is_visible: boolean;
  custom_config: Record<string, string>;
}

interface QuickLink {
  id: string;
  icon_library: string;
  icon_name: string;
  label: string;
  description: string;
  url: string;
  icon_color: string;
  bg_color: string;
  display_order: number;
  is_active: boolean;
}

const BUILT_IN_KEYS = ['hero_slider', 'quick_links', 'welcome', 'sunday_school_lesson', 'vision_mission', 'events'];

const SECTION_LABELS: Record<string, string> = {
  hero_slider: 'Hero Slider — managed via Hero Slider page',
  quick_links: 'Quick Links — managed in the Quick Links tab',
  welcome: 'Welcome Message — managed via Page Content',
  sunday_school_lesson: 'Sunday School Lesson — managed via Sunday School CMS content',
  vision_mission: 'Vision & Mission — managed via Page Content',
  events: 'Upcoming Events — auto-pulled from Events',
};

const COLOR_PRESETS = [
  { label: 'White', icon: 'text-white', bg: 'bg-white/20' },
  { label: 'Red', icon: 'text-red-400', bg: 'bg-red-400/25' },
  { label: 'Amber', icon: 'text-amber-400', bg: 'bg-amber-400/25' },
  { label: 'Sky', icon: 'text-sky-300', bg: 'bg-sky-300/20' },
  { label: 'Green', icon: 'text-emerald-400', bg: 'bg-emerald-400/20' },
  { label: 'Purple', icon: 'text-purple-400', bg: 'bg-purple-400/20' },
  { label: 'Pink', icon: 'text-pink-400', bg: 'bg-pink-400/20' },
  { label: 'Orange', icon: 'text-orange-400', bg: 'bg-orange-400/20' },
];

const emptyLink: Omit<QuickLink, 'id'> = {
  icon_library: 'lucide',
  icon_name: 'Link',
  label: '',
  description: '',
  url: '/',
  icon_color: 'text-white',
  bg_color: 'bg-white/20',
  display_order: 99,
  is_active: true,
};

/* ─── Sections Tab ───────────────────────────────────────── */
function SectionsTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sections = [], isLoading } = useQuery({
    queryKey: ['home_sections'],
    queryFn: async () => {
      const { data } = await supabase.from('home_sections').select('*').order('display_order');
      return (data ?? []) as HomeSection[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (s: HomeSection) => {
      const { error } = await supabase.from('home_sections').update({
        is_visible: s.is_visible,
        display_order: s.display_order,
        label: s.label,
      }).eq('id', s.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home_sections'] });
    },
    onError: () => toast({ title: 'Failed to update', variant: 'destructive' }),
  });

  const toggleVisible = (s: HomeSection) => {
    updateMutation.mutate({ ...s, is_visible: !s.is_visible });
  };

  const move = (idx: number, dir: -1 | 1) => {
    const arr = [...sections];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= arr.length) return;
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    arr.forEach((s, i) => updateMutation.mutate({ ...s, display_order: i + 1 }));
    toast({ title: 'Order saved' });
    logActivity('Reordered homepage sections', 'Homepage');
  };

  if (isLoading) return <div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>;

  return (
    <div className="space-y-2">
      <p className="font-serif text-xs text-muted-foreground mb-4">
        Control which sections appear on the homepage and in what order. Toggle visibility or drag to reorder.
      </p>
      {sections.map((s, idx) => (
        <div key={s.id} className={`flex items-center gap-3 p-4 rounded-xl border bg-card transition-all ${s.is_visible ? 'border-border' : 'border-dashed border-border/50 opacity-60'}`}>
          <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-serif font-semibold text-sm text-foreground">{s.label}</p>
            <p className="font-serif text-xs text-muted-foreground">{SECTION_LABELS[s.section_key] || s.section_key}</p>
          </div>
          <Badge variant={s.is_visible ? 'default' : 'secondary'} className="text-xs shrink-0">
            {s.is_visible ? 'Visible' : 'Hidden'}
          </Badge>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => move(idx, -1)} disabled={idx === 0}><ChevronUp className="w-3.5 h-3.5" /></Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => move(idx, 1)} disabled={idx === sections.length - 1}><ChevronDown className="w-3.5 h-3.5" /></Button>
            <Button
              variant="ghost" size="sm"
              className={`h-7 w-7 p-0 ${s.is_visible ? 'text-foreground' : 'text-muted-foreground'}`}
              onClick={() => toggleVisible(s)}
            >
              {s.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Quick Links Tab ────────────────────────────────────── */
function QuickLinksTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyLink });
  const [pickerOpen, setPickerOpen] = useState(false);

  const { data: links = [], isLoading } = useQuery({
    queryKey: ['admin_quick_links'],
    queryFn: async () => {
      const { data } = await supabase.from('quick_links').select('*').order('display_order');
      return (data ?? []) as QuickLink[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await supabase.from('quick_links').update(form).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('quick_links').insert(form);
        if (error) throw error;
      }
      await logActivity(editId ? 'Updated quick link' : 'Created quick link', 'Homepage', form.label);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_quick_links'] });
      queryClient.invalidateQueries({ queryKey: ['quick_links'] });
      toast({ title: editId ? 'Link updated!' : 'Link created!' });
      setShowForm(false); setEditId(null); setForm({ ...emptyLink });
    },
    onError: () => toast({ title: 'Failed to save', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('quick_links').delete().eq('id', id);
      if (error) throw error;
      await logActivity('Deleted quick link', 'Homepage');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_quick_links'] });
      queryClient.invalidateQueries({ queryKey: ['quick_links'] });
      toast({ title: 'Link deleted' });
    },
  });

  const move = async (idx: number, dir: -1 | 1) => {
    const arr = [...links];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= arr.length) return;
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    await Promise.all(arr.map((l, i) => supabase.from('quick_links').update({ display_order: i + 1 }).eq('id', l.id)));
    queryClient.invalidateQueries({ queryKey: ['admin_quick_links'] });
    queryClient.invalidateQueries({ queryKey: ['quick_links'] });
  };

  const startEdit = (l: QuickLink) => {
    setForm({ icon_library: l.icon_library, icon_name: l.icon_name, label: l.label, description: l.description, url: l.url, icon_color: l.icon_color, bg_color: l.bg_color, display_order: l.display_order, is_active: l.is_active });
    setEditId(l.id); setShowForm(true);
  };

  const onIconPick = (icon: SelectedIcon) => {
    setForm(f => ({ ...f, icon_library: icon.library, icon_name: icon.name }));
  };

  const pickColor = (preset: typeof COLOR_PRESETS[number]) => {
    setForm(f => ({ ...f, icon_color: preset.icon, bg_color: preset.bg }));
  };

  if (isLoading) return <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-serif text-xs text-muted-foreground">Manage the quick link cards shown on the homepage.</p>
        <Button size="sm" onClick={() => { setForm({ ...emptyLink }); setEditId(null); setShowForm(true); }} className="font-serif gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" /> Add Link
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm">{editId ? 'Edit Link' : 'New Quick Link'}</h3>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setShowForm(false); setEditId(null); }}><X className="w-3.5 h-3.5" /></Button>
          </div>

          {/* Icon preview + picker */}
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full ${form.bg_color} bg-primary flex items-center justify-center shrink-0`}>
              <DynamicIcon library={form.icon_library as 'lucide' | 'fa-solid' | 'fa-brands'} name={form.icon_name} className={`w-7 h-7 ${form.icon_color}`} />
            </div>
            <div className="flex-1 space-y-2">
              <Button variant="outline" size="sm" className="font-serif text-xs w-full gap-1.5" onClick={() => setPickerOpen(true)}>
                <Sliders className="w-3.5 h-3.5" /> Change Icon
              </Button>
              <div className="flex gap-1.5 flex-wrap">
                {COLOR_PRESETS.map(p => (
                  <button
                    key={p.label}
                    title={p.label}
                    onClick={() => pickColor(p)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${form.icon === p.icon ? 'border-primary scale-110' : 'border-border hover:border-primary/50'}`}
                    style={{ background: p.label === 'White' ? '#fff' : undefined }}
                  >
                    <span className="text-[10px] font-bold">{p.label[0]}</span>
                  </button>
                ))}
                <span className="font-serif text-[10px] text-muted-foreground self-center ml-1">Color</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="font-serif text-xs">Label *</Label>
              <Input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} className="mt-1 font-serif text-sm" placeholder="Online Radio" />
            </div>
            <div>
              <Label className="font-serif text-xs">URL *</Label>
              <Input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} className="mt-1 font-serif text-sm font-mono" placeholder="/online-radio" />
            </div>
            <div className="col-span-2">
              <Label className="font-serif text-xs">Description</Label>
              <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="mt-1 font-serif text-sm" placeholder="Short description" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
              <Label className="font-serif text-xs">Active</Label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.label} className="font-serif gap-1.5 text-sm">
              <Save className="w-3.5 h-3.5" /> {saveMutation.isPending ? 'Saving...' : 'Save Link'}
            </Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }} className="font-serif text-sm">Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {links.map((l, idx) => (
          <div key={l.id} className={`flex items-center gap-3 p-4 rounded-xl border bg-card ${l.is_active ? 'border-border' : 'opacity-60 border-dashed'}`}>
            <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className={`w-10 h-10 rounded-full ${l.bg_color} bg-primary flex items-center justify-center shrink-0`}>
              <DynamicIcon library={l.icon_library as 'lucide' | 'fa-solid' | 'fa-brands'} name={l.icon_name} className={`w-5 h-5 ${l.icon_color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif font-semibold text-sm">{l.label}</p>
              <p className="font-serif text-xs text-muted-foreground">{l.description} · <span className="font-mono">{l.url}</span></p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => move(idx, -1)} disabled={idx === 0}><ChevronUp className="w-3.5 h-3.5" /></Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => move(idx, 1)} disabled={idx === links.length - 1}><ChevronDown className="w-3.5 h-3.5" /></Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => startEdit(l)}><Edit2 className="w-3.5 h-3.5" /></Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => deleteMutation.mutate(l.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>

      <IconPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={onIconPick} />
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
function HomeBuilderInner() {
  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Homepage Builder</h1>
        <p className="text-muted-foreground font-serif text-sm">Control every section of your homepage — order, visibility, and content.</p>
      </div>

      <Tabs defaultValue="sections">
        <TabsList className="font-serif mb-6">
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="quicklinks">Quick Links</TabsTrigger>
        </TabsList>

        <TabsContent value="sections">
          <div className="bg-card rounded-2xl border border-border shadow-card p-6">
            <SectionsTab />
          </div>
        </TabsContent>

        <TabsContent value="quicklinks">
          <div className="bg-card rounded-2xl border border-border shadow-card p-6">
            <QuickLinksTab />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function HomeBuilder() {
  return (
    <AdminGuard>
      <AdminLayout>
        <HomeBuilderInner />
      </AdminLayout>
    </AdminGuard>
  );
}
