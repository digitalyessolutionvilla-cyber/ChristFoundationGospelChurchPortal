import { useState } from 'react';
import { Check, Copy, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ShareActionsProps {
  title: string;
  text: string;
  url?: string;
  className?: string;
}

export function ShareActions({ title, text, url = window.location.href, className = '' }: ShareActionsProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyPost = async () => {
    await navigator.clipboard.writeText(`${title}\n\n${text}`);
    setCopied(true);
    toast({ title: 'Post copied to clipboard' });
    window.setTimeout(() => setCopied(false), 2000);
  };

  const sharePost = async () => {
    if (navigator.share) {
      await navigator.share({ title, text, url });
      return;
    }
    await copyPost();
  };

  const shareWhatsApp = () => {
    const message = `${title}\n\n${text}\n\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 ${className}`}>
      <Button type="button" size="sm" onClick={sharePost} className="gap-2 font-serif">
        <Share2 className="h-4 w-4" />
        Share Post
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={shareWhatsApp} className="gap-2 font-serif">
        <MessageCircle className="h-4 w-4 text-green-600" />
        WhatsApp
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={copyPost} className="gap-2 font-serif">
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
        {copied ? 'Copied' : 'Copy'}
      </Button>
    </div>
  );
}