'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import useStore from '../../store/index';
import { useEffect } from 'react';
import styles from './Nav.module.css';

const Nav = () => {
  const { data: session, status } = useSession();
  const { user, fetchStore } = useStore();

  console.log('user del store: ', user);

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
          <Link href="/backtest">MA8 (En construcción!)</Link>
        </li>
        {/* <li>FAQ</li> */}
        {/* <li>Docs</li> */}
        {/* <li>Change Log</li> */}
        {/* <li>Pricing</li> */}
        <li>Contact: juanchaher99@gmail.com</li>
      </ul>
      <ul>
        <li
          onClick={() => {
            signOut();
          }}
        >
          Log out
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
