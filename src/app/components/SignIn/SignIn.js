'use client';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

import styles from './SignIn.module.css';

const SignIn = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  if (session) {
    router.push('/chat');
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div
        onClick={() =>
          signIn('google', {
            callbackUrl: '/backtest',
          })
        }
      >
        Enter
      </div>
    </div>
  );
};

export default SignIn;
