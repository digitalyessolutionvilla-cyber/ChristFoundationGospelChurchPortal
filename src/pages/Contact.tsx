import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { HandHeart, Mail, Phone, MapPin, Send } from 'lucide-react';

const emptyPrayer = { full_name: '', email: '', phone: '', request: '', is_private: false };
const emptyContact = { full_name: '', email: '', phone: '', subject: '', message: '' };

export default function Contact() {
  const { toast } = useToast();
  const [prayerForm, setPrayerForm] = useState({ ...emptyPrayer });
  const [contactForm, setContactForm] = useState({ ...emptyContact });

  // Read contact info from website_settings
  const { data: contactSettings } = useQuery({
    queryKey: ['contact_settings'],
    queryFn: async () => {
      const { data } = await supabase.from('website_settings').select('key, value').eq('setting_group', 'contact');
      const map: Record<string, string> = {};
      (data ?? []).forEach((s: { key: string; value: string }) => { map[s.key] = s.value; });
      return map;
    },
    staleTime: 60 * 1000,
  });

  const address  = contactSettings?.contact_address  ?? '7, Olusoji Street, Orile Oshodi, P. O. Box 983, Mushin, Lagos';
  const phone1   = contactSettings?.contact_phone_1   ?? '+234 703 009 0757';
  const phone2   = contactSettings?.contact_phone_2   ?? '+234 802 772 3788';
  const phone3   = contactSettings?.contact_phone_3   ?? '+234 806 027 9123';
  const email    = contactSettings?.contact_email     ?? 'cfgcchurch@gmail.com';

  const submitPrayer = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('prayer_requests').insert(prayerForm);
      if (error) throw error;
    },
    onSuccess: () => { toast({ title: 'Prayer request submitted. We will pray with you.' }); setPrayerForm({ ...emptyPrayer }); },
    onError: () => toast({ title: 'Failed to submit. Please try again.', variant: 'destructive' }),
  });

  const submitContact = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('contact_messages').insert(contactForm);
      if (error) throw error;
    },
    onSuccess: () => { toast({ title: 'Message sent! We will get back to you soon.' }); setContactForm({ ...emptyContact }); },
    onError: () => toast({ title: 'Failed to send. Please try again.', variant: 'destructive' }),
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <PageHeader
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out to us with your questions, prayer requests, or feedback."
      />

      <main className="flex-1 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-card rounded-2xl border border-border shadow-card p-6 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><MapPin className="w-6 h-6 text-primary" /></div>
              <h3 className="font-display font-bold text-foreground">Address</h3>
              <p className="font-serif text-sm text-muted-foreground whitespace-pre-line">{address}</p>
            </div>
            <div className="bg-card rounded-2xl border border-border shadow-card p-6 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><Phone className="w-6 h-6 text-primary" /></div>
              <h3 className="font-display font-bold text-foreground">Phone</h3>
              <div className="font-serif text-sm text-muted-foreground space-y-1">
                {phone1 && <p>{phone1}</p>}
                {phone2 && <p>{phone2}</p>}
                {phone3 && <p>{phone3}</p>}
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border shadow-card p-6 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><Mail className="w-6 h-6 text-primary" /></div>
              <h3 className="font-display font-bold text-foreground">Email</h3>
              <a href={`mailto:${email}`} className="font-serif text-sm text-primary hover:underline">{email}</a>
            </div>
          </div>

          <Tabs defaultValue="contact" className="max-w-2xl mx-auto">
            <TabsList className="w-full mb-8">
              <TabsTrigger value="contact" className="flex-1 font-serif gap-2">
                <Mail className="w-4 h-4" /> Contact Us
              </TabsTrigger>
              <TabsTrigger value="prayer" className="flex-1 font-serif gap-2">
                <HandHeart className="w-4 h-4" /> Prayer Request
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contact">
              <div className="bg-card rounded-2xl border border-border shadow-card p-8">
                <h2 className="font-display font-bold text-2xl text-foreground mb-1">Send a Message</h2>
                <p className="font-serif text-sm text-muted-foreground mb-6">We'll respond as soon as possible.</p>
                <form onSubmit={e => { e.preventDefault(); submitContact.mutate(); }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="font-serif text-sm">Full Name *</Label>
                      <Input value={contactForm.full_name} onChange={e => setContactForm(f => ({ ...f, full_name: e.target.value }))} className="mt-1.5 font-serif" required />
                    </div>
                    <div>
                      <Label className="font-serif text-sm">Email *</Label>
                      <Input type="email" value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} className="mt-1.5 font-serif" required />
                    </div>
                    <div>
                      <Label className="font-serif text-sm">Phone (optional)</Label>
                      <Input value={contactForm.phone} onChange={e => setContactForm(f => ({ ...f, phone: e.target.value }))} className="mt-1.5 font-serif" />
                    </div>
                    <div>
                      <Label className="font-serif text-sm">Subject</Label>
                      <Input value={contactForm.subject} onChange={e => setContactForm(f => ({ ...f, subject: e.target.value }))} className="mt-1.5 font-serif" />
                    </div>
                  </div>
                  <div>
                    <Label className="font-serif text-sm">Message *</Label>
                    <Textarea value={contactForm.message} onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))} className="mt-1.5 font-serif min-h-32" required />
                  </div>
                  <Button type="submit" disabled={submitContact.isPending} className="bg-primary text-primary-foreground font-serif gap-2 w-full">
                    <Send className="w-4 h-4" /> {submitContact.isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="prayer">
              <div className="bg-card rounded-2xl border border-border shadow-card p-8">
                <h2 className="font-display font-bold text-2xl text-foreground mb-1">Prayer Request</h2>
                <p className="font-serif text-sm text-muted-foreground mb-6">Share your prayer need with us. We will pray for you in faith.</p>
                <form onSubmit={e => { e.preventDefault(); submitPrayer.mutate(); }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="font-serif text-sm">Your Name *</Label>
                      <Input value={prayerForm.full_name} onChange={e => setPrayerForm(f => ({ ...f, full_name: e.target.value }))} className="mt-1.5 font-serif" required />
                    </div>
                    <div>
                      <Label className="font-serif text-sm">Email (optional)</Label>
                      <Input type="email" value={prayerForm.email} onChange={e => setPrayerForm(f => ({ ...f, email: e.target.value }))} className="mt-1.5 font-serif" />
                    </div>
                  </div>
                  <div>
                    <Label className="font-serif text-sm">Prayer Request *</Label>
                    <Textarea value={prayerForm.request} onChange={e => setPrayerForm(f => ({ ...f, request: e.target.value }))} className="mt-1.5 font-serif min-h-36" placeholder="Share your prayer request here..." required />
                  </div>
                  <div className="flex items-center gap-3 bg-secondary/60 rounded-lg p-3">
                    <Switch checked={prayerForm.is_private} onCheckedChange={v => setPrayerForm(f => ({ ...f, is_private: v }))} />
                    <div>
                      <Label className="font-serif text-sm font-semibold">Keep this private</Label>
                      <p className="text-[11px] text-muted-foreground font-serif">Only church pastors will see this request. It will not be displayed publicly.</p>
                    </div>
                  </div>
                  <Button type="submit" disabled={submitPrayer.isPending} className="bg-church-red hover:bg-church-red/90 text-primary-foreground font-serif gap-2 w-full">
                    <HandHeart className="w-4 h-4" /> {submitPrayer.isPending ? 'Submitting...' : 'Submit Prayer Request'}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
