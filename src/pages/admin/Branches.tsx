import { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/hooks/useAdminProfile';
import { Plus, Trash2, Edit2, Save, ChevronDown, ChevronRight } from 'lucide-react';

interface District { id: string; name: string; display_order: number; }
interface Branch {
  id: string; district_id: string | null; name: string; address: string;
  po_box: string; phones: string[]; is_headquarters: boolean; is_national_camp: boolean;
  pastor_name: string; service_times: string; map_url: string; display_order: number;
}

const emptyDistrictForm = { name: '', display_order: 0 };
const emptyBranchForm = { name: '', address: '', po_box: '', phones: [''], is_headquarters: false, is_national_camp: false, pastor_name: '', service_times: '', map_url: '', display_order: 0 };

function BranchesInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedDistrict, setExpandedDistrict] = useState<string | null>(null);
  const [showDistrictForm, setShowDistrictForm] = useState(false);
  const [editDistrictId, setEditDistrictId] = useState<string | null>(null);
  const [districtForm, setDistrictForm] = useState({ ...emptyDistrictForm });
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const [editBranchId, setEditBranchId] = useState<string | null>(null);
  const [branchForm, setBranchForm] = useState({ ...emptyBranchForm });

  const { data: districts, isLoading } = useQuery({
    queryKey: ['admin_districts'],
    queryFn: async () => {
      const { data } = await supabase.from('church_districts').select('*').order('display_order');
      return (data ?? []) as District[];
    },
  });

  const { data: branches } = useQuery({
    queryKey: ['admin_branches', expandedDistrict],
    queryFn: async () => {
      if (!expandedDistrict) return [];
      const { data } = await supabase.from('church_branches').select('*').eq('district_id', expandedDistrict).order('display_order');
      return (data ?? []) as Branch[];
    },
    enabled: !!expandedDistrict,
  });

  const { data: hqBranches } = useQuery({
    queryKey: ['admin_hq_branches'],
    queryFn: async () => {
      const { data } = await supabase.from('church_branches').select('*').is('district_id', null).order('display_order');
      return (data ?? []) as Branch[];
    },
  });

  const saveDistrict = useMutation({
    mutationFn: async () => {
      if (editDistrictId) {
        await supabase.from('church_districts').update(districtForm).eq('id', editDistrictId);
      } else {
        await supabase.from('church_districts').insert(districtForm);
      }
      await logActivity(editDistrictId ? 'Updated district' : 'Added district', 'Branches', districtForm.name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_districts'] });
      toast({ title: 'District saved!' });
      setShowDistrictForm(false); setEditDistrictId(null); setDistrictForm({ ...emptyDistrictForm });
    },
  });

  const deleteDistrict = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('church_districts').delete().eq('id', id);
      await logActivity('Deleted district', 'Branches');
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin_districts'] }); toast({ title: 'District deleted' }); },
  });

  const saveBranch = useMutation({
    mutationFn: async () => {
      const payload = { ...branchForm, district_id: selectedDistrictId, phones: branchForm.phones.filter(p => p.trim()) };
      if (editBranchId) {
        await supabase.from('church_branches').update(payload).eq('id', editBranchId);
      } else {
        await supabase.from('church_branches').insert(payload);
      }
      await logActivity(editBranchId ? 'Updated branch' : 'Added branch', 'Branches', branchForm.name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_branches', selectedDistrictId] });
      queryClient.invalidateQueries({ queryKey: ['admin_hq_branches'] });
      queryClient.invalidateQueries({ queryKey: ['church_branches'] });
      toast({ title: 'Branch saved!' });
      setShowBranchForm(false); setEditBranchId(null); setBranchForm({ ...emptyBranchForm });
    },
  });

  const deleteBranch = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('church_branches').delete().eq('id', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_branches', expandedDistrict] });
      toast({ title: 'Branch deleted' });
    },
  });

  const BranchForm = () => (
    <div className="bg-card rounded-xl border border-border p-4 mb-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <Label className="font-serif text-xs">Branch Name *</Label>
          <Input value={branchForm.name} onChange={e => setBranchForm(f => ({ ...f, name: e.target.value }))} className="mt-1 font-serif text-sm h-8" />
        </div>
        <div className="md:col-span-2">
          <Label className="font-serif text-xs">Address</Label>
          <Textarea value={branchForm.address} onChange={e => setBranchForm(f => ({ ...f, address: e.target.value }))} className="mt-1 font-serif text-sm min-h-14" />
        </div>
        <div>
          <Label className="font-serif text-xs">P.O. Box</Label>
          <Input value={branchForm.po_box} onChange={e => setBranchForm(f => ({ ...f, po_box: e.target.value }))} className="mt-1 font-serif text-sm h-8" />
        </div>
        <div>
          <Label className="font-serif text-xs">Pastor Name</Label>
          <Input value={branchForm.pastor_name} onChange={e => setBranchForm(f => ({ ...f, pastor_name: e.target.value }))} className="mt-1 font-serif text-sm h-8" />
        </div>
        <div>
          <Label className="font-serif text-xs">Service Times</Label>
          <Input value={branchForm.service_times} onChange={e => setBranchForm(f => ({ ...f, service_times: e.target.value }))} className="mt-1 font-serif text-sm h-8" placeholder="e.g. Sundays 8am & 10am" />
        </div>
        <div>
          <Label className="font-serif text-xs">Google Maps URL</Label>
          <Input value={branchForm.map_url} onChange={e => setBranchForm(f => ({ ...f, map_url: e.target.value }))} className="mt-1 font-serif text-sm h-8" placeholder="https://maps.google.com/..." />
        </div>
        <div className="md:col-span-2">
          <Label className="font-serif text-xs">Phone Numbers (one per line)</Label>
          <Textarea
            value={branchForm.phones.join('\n')}
            onChange={e => setBranchForm(f => ({ ...f, phones: e.target.value.split('\n') }))}
            className="mt-1 font-serif text-sm min-h-14"
            placeholder="+234..."
          />
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={branchForm.is_headquarters} onCheckedChange={v => setBranchForm(f => ({ ...f, is_headquarters: v }))} />
          <Label className="font-serif text-xs">District Headquarters</Label>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <Button size="sm" onClick={() => saveBranch.mutate()} disabled={saveBranch.isPending} className="bg-primary text-primary-foreground font-serif text-xs h-7"><Save className="w-3 h-3 mr-1" /> Save</Button>
        <Button size="sm" variant="outline" onClick={() => setShowBranchForm(false)} className="font-serif text-xs h-7">Cancel</Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Church Branches</h1>
          <p className="text-muted-foreground font-serif text-sm">Manage districts and branch locations.</p>
        </div>
        <Button onClick={() => { setDistrictForm({ ...emptyDistrictForm }); setEditDistrictId(null); setShowDistrictForm(true); }} className="bg-primary text-primary-foreground font-serif gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add District
        </Button>
      </div>

      {showDistrictForm && (
        <div className="bg-card rounded-2xl border border-border shadow-card p-5 mb-5">
          <h2 className="font-display font-semibold mb-3">{editDistrictId ? 'Edit District' : 'Add District'}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="font-serif text-sm">District Name *</Label>
              <Input value={districtForm.name} onChange={e => setDistrictForm(f => ({ ...f, name: e.target.value }))} className="mt-1.5 font-serif" />
            </div>
            <div>
              <Label className="font-serif text-sm">Display Order</Label>
              <Input type="number" value={districtForm.display_order} onChange={e => setDistrictForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} className="mt-1.5 font-serif" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={() => saveDistrict.mutate()} disabled={saveDistrict.isPending} className="bg-primary text-primary-foreground font-serif gap-2"><Save className="w-4 h-4" /> Save</Button>
            <Button variant="outline" onClick={() => setShowDistrictForm(false)} className="font-serif">Cancel</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-2">
          {districts?.map(district => (
            <div key={district.id} className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <button onClick={() => setExpandedDistrict(expandedDistrict === district.id ? null : district.id)} className="flex-1 flex items-center gap-2 text-left">
                  {expandedDistrict === district.id ? <ChevronDown className="w-4 h-4 text-primary" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  <span className="font-display font-semibold text-sm text-foreground">{district.name}</span>
                </button>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => { setSelectedDistrictId(district.id); setBranchForm({ ...emptyBranchForm }); setEditBranchId(null); setExpandedDistrict(district.id); setShowBranchForm(true); }} className="bg-primary text-primary-foreground font-serif text-xs h-7 gap-1"><Plus className="w-3 h-3" /> Branch</Button>
                  <Button variant="outline" size="sm" onClick={() => { setDistrictForm({ name: district.name, display_order: district.display_order }); setEditDistrictId(district.id); setShowDistrictForm(true); }} className="h-7 text-xs font-serif"><Edit2 className="w-3 h-3" /></Button>
                  <Button variant="outline" size="sm" onClick={() => deleteDistrict.mutate(district.id)} className="text-destructive border-destructive/30 hover:bg-destructive/10 h-7"><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>

              {expandedDistrict === district.id && (
                <div className="border-t border-border p-4 bg-secondary/20 space-y-2">
                  {showBranchForm && selectedDistrictId === district.id && <BranchForm />}
                  {branches?.map(b => (
                    <div key={b.id} className="bg-card rounded-lg border border-border p-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-serif font-medium text-sm text-foreground">{b.name} {b.is_headquarters && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-1">HQ</span>}</p>
                        <p className="text-xs text-muted-foreground font-serif">{b.address}</p>
                        <p className="text-xs text-muted-foreground font-serif">{b.phones?.join(', ')}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Button variant="outline" size="sm" onClick={() => { setBranchForm({ name: b.name, address: b.address, po_box: b.po_box, phones: b.phones ?? [], is_headquarters: b.is_headquarters, is_national_camp: b.is_national_camp, pastor_name: b.pastor_name, service_times: b.service_times, map_url: b.map_url, display_order: b.display_order }); setEditBranchId(b.id); setSelectedDistrictId(district.id); setShowBranchForm(true); }} className="h-6 w-6 p-0"><Edit2 className="w-3 h-3" /></Button>
                        <Button variant="outline" size="sm" onClick={() => deleteBranch.mutate(b.id)} className="h-6 w-6 p-0 text-destructive border-destructive/30"><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Headquarters */}
      {hqBranches && hqBranches.length > 0 && (
        <div className="mt-6">
          <h2 className="font-display font-semibold text-sm text-muted-foreground mb-3">Headquarters & National Camp Ground</h2>
          {showBranchForm && selectedDistrictId === null && <BranchForm />}
          <div className="space-y-2">
            {hqBranches.map(b => (
              <div key={b.id} className="bg-card rounded-xl border border-border p-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif font-semibold text-sm text-foreground">{b.name}</p>
                  <p className="text-xs text-muted-foreground font-serif">{b.address}</p>
                  <p className="text-xs text-muted-foreground font-serif">{b.phones?.join(', ')}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => { setBranchForm({ name: b.name, address: b.address, po_box: b.po_box, phones: b.phones ?? [], is_headquarters: b.is_headquarters, is_national_camp: b.is_national_camp, pastor_name: b.pastor_name, service_times: b.service_times, map_url: b.map_url, display_order: b.display_order }); setEditBranchId(b.id); setSelectedDistrictId(null); setShowBranchForm(true); }} className="h-7 text-xs font-serif gap-1"><Edit2 className="w-3 h-3" /> Edit</Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const Branches = () => (
  <AdminGuard>
    <AdminLayout>
      <BranchesInner />
    </AdminLayout>
  </AdminGuard>
);

export default Branches;
