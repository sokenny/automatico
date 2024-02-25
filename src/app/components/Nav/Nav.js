'use client';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import useStore from '../../store/index';
import { useEffect } from 'react';
import styles from './Nav.module.css';

const Nav = () => {
  const { data: session, status } = useSession();
  const { user, fetchStore } = useStore();

  console.log('user del store: ', user);

  // get nextjs token from jwt
  const secret = process.env.JWT_SECRET;

  useEffect(() => {
    // if session.user and no user, set user
    if (session?.user && !user) {
      console.log('session!', session.user.email);
      fetchStore(session);
    }
  }, [session]);

  console.log('sessionsita: ', session);
  return (
    <nav className={styles.container}>
      <ul>
        <li>
          <Link href="/backtest">MA8</Link>
        </li>
        {/* <li>FAQ</li> */}
        <li>Docs</li>
        {/* <li>Change Log</li> */}
        <li>Pricing</li>
      </ul>
      <ul>
        <li>Account</li>
      </ul>
    </nav>
  );
};

export default Nav;
