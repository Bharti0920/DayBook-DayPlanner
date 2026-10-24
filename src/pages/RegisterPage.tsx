import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/context/RouterContext';
import { AuthLayout } from '@/components/AuthLayout';

export function RegisterPage() {
  const { signUp } = useAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);
    if (error) { setError(error); return; }
    navigate('dashboard');
  };

  return (
    <AuthLayout
      heading="Begin your day, better."
      subheading="Create a free workspace. No credit card needed."
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
            Choose a password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
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
          Create my workspace
        </button>
      </form>

      <div className="mt-8 pt-7 border-t border-[#d9d4cb] text-center">
        <p className="text-sm text-[#938d83]">
          Already have a workspace?{' '}
          <button
            onClick={() => navigate('login')}
            className="text-[#214f43] font-medium hover:underline underline-offset-2"
          >
            Sign in
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
