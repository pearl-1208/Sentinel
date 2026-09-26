'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from '@/components/LoginPage';
import BrandLoader from '@/components/BrandLoader';
import { useToast } from '@/components/ToastProvider';

export default function LoginRoutePage() {
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('sentinel_auth');
      if (savedAuth) {
        router.replace('/');
      }
    } catch (e) {}
  }, [router]);

  const handleLogin = (user) => {
    try {
      localStorage.setItem('sentinel_auth', JSON.stringify(user));
    } catch (e) {}
    addToast({ message: `Welcome, ${user.name} — ${user.role} access granted`, type: 'success' });
    router.push('/');
  };

  return (
    <>
      <BrandLoader />
      <LoginPage onLogin={handleLogin} />
    </>
  );
}
