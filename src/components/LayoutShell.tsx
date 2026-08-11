'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import styles from '@/components/Sidebar.module.css';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = pathname === '/login' || pathname === '/signup' || pathname === '/landing';

  return (
    <div className={styles.layout}>
      {!isPublicPage && <Sidebar />}
      <main className={isPublicPage ? styles.authMain : styles.main}>
        {children}
      </main>
    </div>
  );
}
