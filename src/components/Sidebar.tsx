'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { signOutAction } from '@/app/actions/auth';
import ClinicSwitcher from '@/components/ClinicSwitcher';
import styles from './Sidebar.module.css';

const navItems = [
  { label: '📊 Dashboard', path: '/dashboard' },
  { label: '✨ Generate Caption', path: '/' },
  { label: '🗓️ 30-Day Planner', path: '/batch' },
  { label: '💡 Knowledge Bank', path: '/notes' },
  { label: '📝 Drafts & Calendar', path: '/drafts' },
  { label: '🏥 Practice Profile', path: '/profile' },
  { label: '⚙️ Settings & Channels', path: '/settings' },
  { label: '💳 Pricing & Plans', path: '/pricing' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Hide sidebar on auth and public landing pages
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/landing';

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isAuthPage) {
    return null;
  }

  const initial = userEmail ? userEmail.charAt(0).toUpperCase() : 'P';

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        CaptionAI
      </div>

      <ClinicSwitcher />

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.userFooter}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {initial}
          </div>
          <span className={styles.userEmail} title={userEmail || 'Practice Admin'}>
            {userEmail || 'Practice Admin'}
          </span>
        </div>

        <form action={signOutAction}>
          <button type="submit" className={styles.signOutBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
