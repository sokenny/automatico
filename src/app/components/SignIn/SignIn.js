'use client';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Button } from '@nextui-org/react';
import styles from './SignIn.module.css';

const SignIn = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  if (session) {
    router.push('/backtest');
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>
            <span>AI</span> powered backtests for your{' '}
            <span>crypto trading</span> strategies.
          </h1>
          <div className={styles.offer}>
            <span className={styles.crossed}>
              USD <span>19.99</span> / month.
            </span>
            <span className={styles.free}>
              <span>FREE</span> during Beta
            </span>
          </div>
        </div>
        <div className={styles.loomContainer}>
          <div>
            <iframe
              src="https://www.loom.com/embed/e8963c5f6bd74b2d947fa16a6af17561?sid=b0d819a1-a972-4375-9d5e-6941c79c7ea9"
              frameBorder="0"
              webkitallowfullscreen="true"
              mozallowfullscreen="true"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <Button
          color="primary"
          size="lg"
          className={styles.button}
          onPress={() =>
            signIn('google', {
              callbackUrl: '/backtest',
            })
          }
        >
          Accedé Gratis
        </Button>
      </div>
    </div>
  );
};

export default SignIn;
