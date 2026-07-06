import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, UserPlus } from 'lucide-react';

const LOGO_URL = 'https://cdn.enter.pro/resources/uid_100066245/29b71ed7-ea27-47.png';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
      } else {
        navigate('/admin/dashboard');
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin/dashboard` },
      });
      setLoading(false);
      if (error) {
        toast({ title: 'Registration failed', description: error.message, variant: 'destructive' });
      } else {
        toast({
          title: 'Account created!',
          description: 'You can now sign in with your credentials.',
        });
        setMode('login');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src={LOGO_URL}
            alt="CFGC Logo"
            className="h-20 w-20 rounded-full mx-auto mb-4 shadow-gold"
            crossOrigin="anonymous"
          />
          <h1 className="font-display text-2xl font-bold text-primary-foreground">CFGC Admin Portal</h1>
          <p className="text-primary-foreground/70 font-serif text-sm mt-1">Content Management System</p>
        </div>

        <div className="bg-card rounded-2xl shadow-blue border border-border p-8">
          <div className="flex items-center gap-2 mb-6">
            {mode === 'login' ? (
              <Lock className="w-5 h-5 text-primary" />
            ) : (
              <UserPlus className="w-5 h-5 text-primary" />
            )}
            <h2 className="font-display font-bold text-xl text-foreground">
              {mode === 'login' ? 'Sign In' : 'Create Admin Account'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="font-serif text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cfgc.org"
                className="mt-1.5 font-serif"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="font-serif text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 font-serif"
                required
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-serif font-semibold"
            >
              {loading
                ? mode === 'login' ? 'Signing In...' : 'Creating Account...'
                : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t border-border text-center">
            {mode === 'login' ? (
              <p className="font-serif text-sm text-muted-foreground">
                First time?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-primary font-semibold hover:underline"
                >
                  Create an admin account
                </button>
              </p>
            ) : (
              <p className="font-serif text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
