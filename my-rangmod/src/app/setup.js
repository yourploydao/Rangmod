import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Signup from '../pages/signup';
import Login from '../pages/signin';
import ForgotPassword from '../pages/forgotpassword';
import VerifyCode from '../pages/verifycode';
import ResetPassword from '../pages/resetpassword';
import HomeBeforeLogin from '../pages/home-before-login';

export default function AuthRouter() {
  const router = useRouter();
  const { auth } = router.query;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // redirect ถ้าไม่มี auth
    if (router.isReady && typeof auth !== 'string') {
      router.replace('/home');
    }
  }, [router.isReady, auth]);

  if (!mounted || !router.isReady || typeof auth !== 'string') return null;

  switch (auth) {
    case 'signup':
      return <Signup />;
    case 'signin':
      return <Login />;
    case 'forgotpassword':
      return <ForgotPassword />;
    case 'verifycode':
      return <VerifyCode />;
    case 'resetpassword':
      return <ResetPassword />;
    case 'home':
      return <HomeBeforeLogin />;
    default:
      return <h1>404 - Not Found</h1>;
  }
}
