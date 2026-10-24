import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  AuthError,
  MissingIdentityError,
  getUser,
  handleAuthCallback,
  login,
  logout,
  onAuthChange,
  signup,
  type User,
} from '@netlify/identity';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function describeError(error: unknown, fallback: string) {
  if (error instanceof MissingIdentityError) return 'Sign-in is not available right now. Please try again later.';
  if (error instanceof AuthError) {
    if (error.status === 401) return 'Invalid email or password.';
    if (error.status === 403) return 'New signups are currently disabled.';
    return error.message;
  }
  return fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        // Processes email-confirmation / recovery links that land with a token in the URL hash.
        const result = await handleAuthCallback();
        if (result) {
          window.history.replaceState(null, '', `${window.location.pathname}#dashboard`);
          window.dispatchEvent(new HashChangeEvent('hashchange'));
        }
      } catch (error) {
        console.error('Auth callback failed', error);
      }
      const current = await getUser();
      if (active) {
        setUser(current);
        setLoading(false);
      }
    })();

    const unsubscribe = onAuthChange((_event, newUser) => setUser(newUser));
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const newUser = await signup(email, password);
      if (newUser.confirmedAt) {
        setUser(newUser);
        return { error: null };
      }
      return { error: null, needsConfirmation: true };
    } catch (error) {
      return { error: describeError(error, 'Could not create your account.') };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setUser(await login(email, password));
      return { error: null };
    } catch (error) {
      return { error: describeError(error, 'Could not sign you in.') };
    }
  };

  const signOut = async () => {
    try {
      await logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
