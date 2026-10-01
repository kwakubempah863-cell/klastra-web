import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentProfile, signOut as signOutService } from '../services/authService';

type Profile = {
  id: string;
  role: 'student' | 'parent' | 'tutor' | 'admin';
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  email: string | null;
};

type AuthContextType = {
  profile: Profile | null;
  loading: boolean;
  refresh: () => Promise<Profile | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  profile: null,
  loading: true,
  refresh: async () => null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const currentProfile = await getCurrentProfile() as Profile | null;
      setProfile(currentProfile);
      return currentProfile;
    } catch {
      setProfile(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => void load(), 0);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOutService();
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ profile, loading, refresh: load, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);