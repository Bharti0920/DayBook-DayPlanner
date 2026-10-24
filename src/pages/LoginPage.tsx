import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/context/RouterContext';
import { AuthLayout } from '@/components/AuthLayout';

export function LoginPage() {
  const { signIn } = useAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { setError(error); return; }
    navigate('dashboard');
  };

  return (
    <AuthLayout
      heading="Welcome back."
      subheading="Sign in to pick up right where you left off."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-[#938d83] mb-2">
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-[#fffdfa] border border-[#d9d4cb] rounded-2xl px-5 py-3.5 text-sm text-[#2c302b] placeholder-[#b2ada4] outline-none focus:border-[#214f43] focus:ring-2 focus:ring-[#214f43]/10 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-[#938d83] mb-2">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#fffdfa] border border-[#d9d4cb] rounded-2xl px-5 py-3.5 text-sm text-[#2c302b] placeholder-[#b2ada4] outline-none focus:border-[#214f43] focus:ring-2 focus:ring-[#214f43]/10 transition-all"
          />
        </div>

        {error && (
          <p className="text-sm text-[#9a4f47] bg-[#f5ebe9] border border-[#e8d0cc] rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#214f43] text-white py-3.5 text-sm font-medium hover:bg-[#183d34] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          Sign in to Daybook
        </button>
      </form>

      <div className="mt-8 pt-7 border-t border-[#d9d4cb] text-center">
        <p className="text-sm text-[#938d83]">
          No account yet?{' '}
          <button
            onClick={() => navigate('register')}
            className="text-[#214f43] font-medium hover:underline underline-offset-2"
          >
            Create your workspace
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
