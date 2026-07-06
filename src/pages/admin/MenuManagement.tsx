import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/shared/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/hooks/useAdminProfile';
import { Plus, Trash2, Edit2, Save, X, ExternalLink, ChevronRight, ChevronDown, GripVertical, Menu, Globe } from 'lucide-react';

interface NavMenu {
  id: string;
  name: string;
  slug: string;
  location: string;
}

interface NavMenuItem {
  id: string;
  menu_id: string;
  parent_id: string | null;
  label: string;
  url: string;
  target: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  children?: NavMenuItem[];
}

const emptyItem = { label: '', url: '/', target: '_self', icon: '', display_order: 0, is_active: true, parent_id: '' };

function MenusInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMenu, setSelectedMenu] = useState<NavMenu | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState({ ...emptyItem });

  const { data: menus = [], isLoading: menusLoading } = useQuery({
    queryKey: ['nav_menus'],
    queryFn: async () => {
      const { data } = await supabase.from('nav_menus').select('*').order('name');
      return (data ?? []) as NavMenu[];
    },
  });

  const { data: menuItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['nav_menu_items', selectedMenu?.id],
    enabled: !!selectedMenu,
    queryFn: async () => {
      const { data } = await supabase.from('nav_menu_items').select('*').eq('menu_id', selectedMenu!.id).order('display_order');
      return (data ?? []) as NavMenuItem[];
    },
  });

  const saveItemMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        menu_id: selectedMenu!.id,
        label: itemForm.label,
        url: itemForm.url,
        target: itemForm.target,
        icon: itemForm.icon,
        display_order: itemForm.display_order,
        is_active: itemForm.is_active,
        parent_id: itemForm.parent_id || null,
      };
      if (editItemId) {
        const { error } = await supabase.from('nav_menu_items').update(payload).eq('id', editItemId);
        if (error) throw error;
        await logActivity('Updated menu item', 'Menus', itemForm.label);
      } else {
        const { error } = await supabase.from('nav_menu_items').insert(payload);
        if (error) throw error;
        await logActivity('Added menu item', 'Menus', itemForm.label);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nav_menu_items', selectedMenu?.id] });
      toast({ title: editItemId ? 'Menu item updated!' : 'Menu item added!' });
      setShowItemForm(false); setEditItemId(null); setItemForm({ ...emptyItem });
    },
    onError: (e) => toast({ title: (e as Error).message, variant: 'destructive' }),
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('nav_menu_items').delete().eq('id', id);
      if (error) throw error;
      await logActivity('Deleted menu item', 'Menus');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nav_menu_items', selectedMenu?.id] });
      toast({ title: 'Item deleted' });
    },
  });

  const toggleItemMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from('nav_menu_items').update({ is_active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['nav_menu_items', selectedMenu?.id] }),
  });

  const startEditItem = (item: NavMenuItem) => {
    setItemForm({
      label: item.label, url: item.url, target: item.target, icon: item.icon,
      display_order: item.display_order, is_active: item.is_active,
      parent_id: item.parent_id || '',
    });
    setEditItemId(item.id);
    setShowItemForm(true);
  };

  // Build tree structure: top-level items and their children
  const topLevel = menuItems.filter(i => !i.parent_id);
  const getChildren = (parentId: string) => menuItems.filter(i => i.parent_id === parentId);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Menu className="w-6 h-6 text-primary" />
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">Menu Management</h1>
            <p className="text-sm font-serif text-muted-foreground">Manage website navigation menus</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Menu List */}
          <div className="lg:col-span-1 space-y-2">
            <p className="font-serif font-semibold text-sm text-foreground mb-3">Navigation Menus</p>
            {menusLoading ? (
              <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}</div>
            ) : (
              menus.map(menu => (
                <button
                  key={menu.id}
                  onClick={() => setSelectedMenu(menu)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                    selectedMenu?.id === menu.id
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-card hover:border-primary/30'
                  }`}
                >
                  <p className="font-serif font-semibold text-sm">{menu.name}</p>
                  <p className="font-serif text-xs text-muted-foreground capitalize">{menu.location}</p>
                </button>
              ))
            )}
          </div>

          {/* Menu Items */}
          <div className="lg:col-span-3 space-y-4">
            {!selectedMenu ? (
              <div className="border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground">
                <Globe className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-serif">Select a menu to manage its items</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="font-serif font-semibold text-foreground">{selectedMenu.name} Items</p>
                  <Button size="sm" onClick={() => { setShowItemForm(true); setEditItemId(null); setItemForm({ ...emptyItem, display_order: menuItems.length }); }} className="font-serif">
                    <Plus className="w-4 h-4 mr-1" /> Add Item
                  </Button>
                </div>

                {/* Add/Edit Form */}
                {showItemForm && (
                  <div className="border border-border rounded-xl p-4 bg-card space-y-3">
                    <h3 className="font-serif font-semibold text-sm">{editItemId ? 'Edit Menu Item' : 'New Menu Item'}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="font-serif text-xs">Label *</Label>
                        <Input value={itemForm.label} onChange={e => setItemForm(f => ({ ...f, label: e.target.value }))} className="mt-1 font-serif text-sm" placeholder="Home" />
                      </div>
                      <div>
                        <Label className="font-serif text-xs">URL *</Label>
                        <Input value={itemForm.url} onChange={e => setItemForm(f => ({ ...f, url: e.target.value }))} className="mt-1 font-serif text-sm font-mono" placeholder="/ or https://..." />
                      </div>
                      <div>
                        <Label className="font-serif text-xs">Parent Item (sub-menu)</Label>
                        <select value={itemForm.parent_id} onChange={e => setItemForm(f => ({ ...f, parent_id: e.target.value }))} className="mt-1 w-full font-serif text-sm border border-input rounded-md px-3 py-2 bg-background">
                          <option value="">-- Top Level --</option>
                          {topLevel.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <Label className="font-serif text-xs">Open In</Label>
                        <select value={itemForm.target} onChange={e => setItemForm(f => ({ ...f, target: e.target.value }))} className="mt-1 w-full font-serif text-sm border border-input rounded-md px-3 py-2 bg-background">
                          <option value="_self">Same Tab</option>
                          <option value="_blank">New Tab</option>
                        </select>
                      </div>
                      <div>
                        <Label className="font-serif text-xs">Display Order</Label>
                        <Input type="number" value={itemForm.display_order} onChange={e => setItemForm(f => ({ ...f, display_order: +e.target.value }))} className="mt-1 font-serif text-sm" />
                      </div>
                      <div className="flex items-center gap-2 pt-4">
                        <Switch checked={itemForm.is_active} onCheckedChange={v => setItemForm(f => ({ ...f, is_active: v }))} />
                        <Label className="font-serif text-sm">Active</Label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => saveItemMutation.mutate()} disabled={!itemForm.label || saveItemMutation.isPending} className="font-serif">
                        <Save className="w-3 h-3 mr-1" /> {saveItemMutation.isPending ? 'Saving...' : 'Save'}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setShowItemForm(false); setEditItemId(null); }} className="font-serif">
                        <X className="w-3 h-3 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Items Tree */}
                {itemsLoading ? (
                  <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}</div>
                ) : topLevel.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground font-serif text-sm">No menu items yet. Add some above!</p>
                ) : (
                  <div className="space-y-2">
                    {topLevel.map(item => {
                      const children = getChildren(item.id);
                      return (
                        <div key={item.id}>
                          <div className={`flex items-center gap-3 p-3 rounded-lg border ${item.is_active ? 'border-border bg-card' : 'border-border/40 bg-muted/20 opacity-60'}`}>
                            <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-serif font-semibold text-sm text-foreground">{item.label}</p>
                                {item.target === '_blank' && <ExternalLink className="w-3 h-3 text-muted-foreground" />}
                                {children.length > 0 && <Badge variant="secondary" className="text-xs">{children.length} sub-items</Badge>}
                              </div>
                              <p className="font-mono text-xs text-muted-foreground">{item.url}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Switch checked={item.is_active} onCheckedChange={v => toggleItemMutation.mutate({ id: item.id, is_active: v })} />
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => startEditItem(item)}>
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => deleteItemMutation.mutate(item.id)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          {/* Sub-items */}
                          {children.map(child => (
                            <div key={child.id} className={`flex items-center gap-3 p-3 ml-6 mt-1 rounded-lg border ${child.is_active ? 'border-border bg-card/50' : 'border-border/40 bg-muted/20 opacity-60'}`}>
                              <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-serif text-sm text-foreground">{child.label}</p>
                                <p className="font-mono text-xs text-muted-foreground">{child.url}</p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <Switch checked={child.is_active} onCheckedChange={v => toggleItemMutation.mutate({ id: child.id, is_active: v })} />
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => startEditItem(child)}>
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => deleteItemMutation.mutate(child.id)}>
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function MenuManagement() {
  return <AdminGuard><MenusInner /></AdminGuard>;
}
