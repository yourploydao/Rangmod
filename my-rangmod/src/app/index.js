// pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to home-before-login or login page
    router.push('/home');
  }, [router]);

  return <div>Redirecting...</div>;
}