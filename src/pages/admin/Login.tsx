import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Eye, EyeOff } from 'lucide-react';

const LOGO_URL = 'https://cdn.enter.pro/resources/uid_100066245/29b71ed7-ea27-47.png';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });

  const siteUrl = (import.meta.env.VITE_SITE_URL as string) || window.location.origin;
  const adminRedirectUrl = `${siteUrl.replace(/\/$/, '')}/admin/login`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;

        // Update last login
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase.from('admin_profiles').update({ last_login: new Date().toISOString() }).eq('user_id', session.user.id);
        }

        navigate('/admin/dashboard');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { emailRedirectTo: adminRedirectUrl },
        });
        if (error) throw error;

        if (data.user) {
          // Create admin profile (inactive by default, super admin must activate)
          await supabase.from('admin_profiles').upsert({
            user_id: data.user.id,
            full_name: form.fullName,
            role_slug: 'content_editor',
            is_active: true,
          }, { onConflict: 'user_id' });

          toast({ title: 'Account created! You can now log in. A Super Administrator may need to assign your role.' });
          setMode('login');
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toast({ title: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={LOGO_URL} alt="CFGC" className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white/20 shadow-blue" crossOrigin="anonymous" />
          <h1 className="font-display font-bold text-white text-xl">CFGC Admin</h1>
          <p className="text-white/70 font-serif text-sm">Content Management System</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-8">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-lg text-foreground">
              {mode === 'login' ? 'Administrator Login' : 'Create Admin Account'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <Label htmlFor="fullName" className="font-serif text-sm">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  className="mt-1.5 font-serif"
                  placeholder="Your full name"
                  required={mode === 'register'}
                />
              </div>
            )}
            <div>
              <Label htmlFor="email" className="font-serif text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="mt-1.5 font-serif"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="font-serif text-sm">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="font-serif pr-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-serif font-semibold">
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-border text-center">
            {mode === 'login' ? (
              <p className="text-xs font-serif text-muted-foreground">
                Need access?{' '}
                <button onClick={() => setMode('register')} className="text-primary hover:underline font-semibold">Create an account</button>
              </p>
            ) : (
              <p className="text-xs font-serif text-muted-foreground">
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-primary hover:underline font-semibold">Sign in</button>
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-white/50 text-[10px] font-serif mt-6">
          Christ Foundation Gospel Church (Inc.) — Secure Admin Portal
        </p>
      </div>
    </div>
  );
}
