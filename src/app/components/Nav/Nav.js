'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from '@nextui-org/react';

import useStore from '../../store/index';
import { useEffect } from 'react';
import styles from './Nav.module.css';

const Nav = ({ cookies, authToken }) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { user, fetchStore, setCookies } = useStore();

  useEffect(() => {
    if (cookies) {
      setCookies(cookies);
    }
    if (session?.user && !user) {
      fetchStore(session, authToken);
    }
  }, [session]);

  const tabs = [
    { name: 'Backtest', path: '/backtest', isAuth: true },
    { name: 'Strategies', path: '/strategies', isAuth: true },
    { name: 'Guide', path: '/guide', isAuth: false },
  ];

  return (
    <Navbar maxWidth="full" className={styles.container}>
      <NavbarBrand className={styles.identity}>
        <NextLink href={'/backtest'}>
          <p className="text-inherit">
            <b>ma8</b> (en construcción!)
          </p>
        </NextLink>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {tabs.map((tab, i) => {
          const isActive = tab.path === pathname;
          if (tab.isAuth && !session) return null;
          return (
            <NavbarItem
              key={i}
              isActive={isActive}
              className={styles.navItem + ' ' + (isActive ? styles.active : '')}
            >
              <NextLink href={tab.path}>{tab.name}</NextLink>
            </NavbarItem>
          );
        })}
      </NavbarContent>
      <NavbarContent justify="end">
        {session ? (
          <NavbarItem className="hidden lg:flex" onClick={() => signOut()}>
            <div href="#">Log Out</div>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <div onClick={() => signIn('google')}>Login</div>
            </NavbarItem>
            <NavbarItem>
              <Button
                onClick={() => signIn('google')}
                color="primary"
                variant="flat"
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Nav;
