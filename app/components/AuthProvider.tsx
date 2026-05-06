"use client";
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false); // Empêche la double exécution

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initAuth = async () => {
      try {
        // getSession est plus "safe" contre les bugs de lock
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          if (pathname !== '/login') router.push('/login');
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          if (profile.role === 'admin' && !pathname.startsWith('/admin')) {
            router.push('/admin');
          } else if (profile.role === 'agent' && !pathname.startsWith('/agent')) {
            router.push('/agent');
          }
        }
      } catch (error) {
        console.error("Auth Init Error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') router.push('/login');
      if (event === 'SIGNED_IN' && session) {
        // Redirection intelligente après login
        initAuth(); 
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  if (loading && pathname !== '/login') {
    return (
      <div className="h-screen bg-[#020617] flex items-center justify-center text-cyan-500 font-black animate-pulse uppercase">
        Vérification Elite...
      </div>
    );
  }

  return <>{children}</>;
}