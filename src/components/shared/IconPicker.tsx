import { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DynamicIcon } from './DynamicIcon';

export interface SelectedIcon {
  library: 'lucide' | 'fa-solid' | 'fa-brands';
  name: string;
}

interface IconPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (icon: SelectedIcon) => void;
}

// Curated popular Lucide icons for church/general use
const LUCIDE_ICONS = [
  'Radio','Tv','MapPin','Users','Church','Cross','Heart','Star','Music','BookOpen',
  'Globe','Phone','Mail','Calendar','Clock','Home','Image','Video','Link','Share2',
  'ArrowRight','ChevronRight','Plus','Minus','Check','X','Search','Bell','Info',
  'AlertCircle','Shield','Lock','Unlock','Eye','EyeOff','Settings','Sliders','Menu',
  'Grid','List','Layout','Layers','FileText','Download','Upload','ExternalLink',
  'Play','Pause','Volume2','Headphones','Mic','Camera','Film','Youtube',
  'Facebook','Twitter','Instagram','Linkedin','Send','MessageSquare','MessageCircle',
  'UserRound','UserCheck','UserPlus','Award','Trophy','Target','Compass','Flag',
  'Map','Navigation','Building','Building2','Landmark','School','Library',
  'HandHeart','Gift','Smile','Sun','Moon','Cloud','Zap','Flame','Leaf',
  'Anchor','Feather','Infinity','Hash','Percent','DollarSign','CreditCard',
  'Package','Box','Archive','Folder','FolderOpen','Save','Edit','Edit2','Trash2',
  'Copy','Clipboard','Printer','Share','RefreshCw','RotateCcw','undo','Redo',
];

// Curated Font Awesome solid icons
const FA_SOLID_ICONS = [
  'church','cross','bible','praying-hands','hands','hand-holding-heart',
  'dove','star-of-david','menorah','om','peace','yin-yang',
  'music','headphones','microphone','podcast','radio','tv','video',
  'map-marker-alt','map','globe','compass','location-arrow',
  'users','user','user-friends','people-arrows','child','baby',
  'calendar','calendar-alt','clock','hourglass-half',
  'phone','envelope','comment','comments','share-alt',
  'home','building','university','hospital','school',
  'book','book-open','scroll','newspaper','file-alt','file-pdf',
  'heart','star','crown','trophy','medal','award',
  'play','pause','stop','volume-up','bullhorn','bell',
  'camera','image','film','photo-video',
  'download','upload','link','external-link-alt','share',
  'search','bars','times','check','plus','minus','arrow-right',
  'shield','lock','key','eye','lightbulb','fire','leaf','sun','moon',
  'dollar-sign','credit-card','donate','hand-holding-usd',
  'graduation-cap','chalkboard-teacher','hands-helping','handshake',
];

// Curated Font Awesome brand icons
const FA_BRAND_ICONS = [
  'facebook','facebook-f','facebook-square',
  'youtube','youtube-square',
  'instagram','instagram-square',
  'twitter','twitter-square',
  'whatsapp','whatsapp-square',
  'telegram','telegram-plane',
  'tiktok','spotify','apple','google','android',
  'linkedin','linkedin-in','pinterest',
  'vimeo','vimeo-v','soundcloud',
  'paypal','stripe','google-pay','apple-pay',
];

export function IconPicker({ open, onClose, onSelect }: IconPickerProps) {
  const [query, setQuery] = useState('');

  const filteredLucide = useMemo(() =>
    LUCIDE_ICONS.filter(n => n.toLowerCase().includes(query.toLowerCase())),
    [query]
  );
  const filteredSolid = useMemo(() =>
    FA_SOLID_ICONS.filter(n => n.toLowerCase().includes(query.toLowerCase())),
    [query]
  );
  const filteredBrands = useMemo(() =>
    FA_BRAND_ICONS.filter(n => n.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  const pick = (lib: SelectedIcon['library'], name: string) => {
    onSelect({ library: lib, name });
    onClose();
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display">Choose an Icon</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Search icons..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="font-serif"
          autoFocus
        />
        <Tabs defaultValue="lucide">
          <TabsList className="w-full font-serif">
            <TabsTrigger value="lucide" className="flex-1 text-xs">Lucide ({filteredLucide.length})</TabsTrigger>
            <TabsTrigger value="solid" className="flex-1 text-xs">FA Solid ({filteredSolid.length})</TabsTrigger>
            <TabsTrigger value="brands" className="flex-1 text-xs">FA Brands ({filteredBrands.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="lucide">
            <ScrollArea className="h-64">
              <div className="grid grid-cols-8 gap-1 p-1">
                {filteredLucide.map(name => (
                  <button
                    key={name}
                    title={name}
                    onClick={() => pick('lucide', name)}
                    className="flex flex-col items-center justify-center p-1.5 rounded-lg hover:bg-primary/10 transition-colors group"
                  >
                    <DynamicIcon library="lucide" name={name} className="w-5 h-5 text-foreground group-hover:text-primary" />
                    <span className="text-[8px] text-muted-foreground mt-0.5 truncate w-full text-center">{name.slice(0, 8)}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="solid">
            <ScrollArea className="h-64">
              <div className="grid grid-cols-8 gap-1 p-1">
                {filteredSolid.map(name => (
                  <button
                    key={name}
                    title={name}
                    onClick={() => pick('fa-solid', name)}
                    className="flex flex-col items-center justify-center p-1.5 rounded-lg hover:bg-primary/10 transition-colors group"
                  >
                    <DynamicIcon library="fa-solid" name={name} className="w-5 h-5 text-foreground group-hover:text-primary" />
                    <span className="text-[8px] text-muted-foreground mt-0.5 truncate w-full text-center">{name.slice(0, 8)}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="brands">
            <ScrollArea className="h-64">
              <div className="grid grid-cols-8 gap-1 p-1">
                {filteredBrands.map(name => (
                  <button
                    key={name}
                    title={name}
                    onClick={() => pick('fa-brands', name)}
                    className="flex flex-col items-center justify-center p-1.5 rounded-lg hover:bg-primary/10 transition-colors group"
                  >
                    <DynamicIcon library="fa-brands" name={name} className="w-5 h-5 text-foreground group-hover:text-primary" />
                    <span className="text-[8px] text-muted-foreground mt-0.5 truncate w-full text-center">{name.slice(0, 8)}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
