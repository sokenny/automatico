import './globals.css';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './Providers';
import getAuthTokenName from './helpers/getAuthTokenName';
import Nav from './components/Nav/Nav';
import styles from './layout.module.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ma8',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookiesStore = cookies();
  const nextAuth = cookiesStore.get(getAuthTokenName());
  return (
    <html lang="en">
      <body className={`${inter.className} ${styles.layout}`}>
        <Providers>
          <Nav authToken={nextAuth?.value} cookies={cookiesStore} />
          <div className={styles.innerWrapper}>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
