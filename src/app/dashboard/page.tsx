import Link from 'next/link';
import { getDashboardAnalytics } from '@/app/actions/analytics';
import { getUserSubscription } from '@/app/actions/subscription';
import CopyButton from '@/components/CopyButton';
import styles from './Dashboard.module.css';

export default async function DashboardPage() {
  const [data, sub] = await Promise.all([
    getDashboardAnalytics(),
    getUserSubscription(),
  ]);

  const maxWeeklyCount = Math.max(...data.weeklyActivity.map(w => w.count), 1);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Practice Executive Dashboard</h1>
          <p className={styles.subtitle}>
            Welcome back! Here is your AI content performance and scheduling status for <strong>{data.practiceName}</strong> ({data.specialty}).
          </p>
        </div>

        <div className={styles.headerActions}>
          <Link href="/batch" className="btn btn-secondary" style={{ gap: '0.4rem' }}>
            🗓️ 30-Day Planner
          </Link>
          <Link href="/" className="btn btn-primary" style={{ gap: '0.4rem' }}>
            ✨ Generate Caption
          </Link>
        </div>
      </header>

      {/* Metrics Row */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </div>
          <div>
            <div className={styles.metricValue}>{data.totalGenerated}</div>
            <div className={styles.metricLabel}>Total AI Captions</div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div>
            <div className={styles.metricValue}>{data.totalScheduled}</div>
            <div className={styles.metricLabel}>Scheduled Posts</div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <div>
            <div className={styles.metricValue}>{data.notesCount}</div>
            <div className={styles.metricLabel}>Knowledge Bank Notes</div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: '#f3e8ff', color: '#9333ea' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div>
            <div className={styles.metricValue}>
              {sub.monthlyLimit - sub.creditsUsed}
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                /{sub.monthlyLimit}
              </span>
            </div>
            <div className={styles.metricLabel}>Monthly Credits Left</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className={styles.dashboardGrid}>
        {/* Left Column: Weekly Activity Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>📊 Weekly Generation Activity</div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last 7 Days</span>
          </div>

          <div className={styles.chartContainer}>
            {data.weeklyActivity.map((w) => {
              const heightPercent = Math.max((w.count / maxWeeklyCount) * 100, 8);
              return (
                <div key={w.day} className={styles.chartColumn}>
                  <div className={styles.barWrapper}>
                    <div
                      className={styles.bar}
                      style={{ height: `${heightPercent}%` }}
                      title={`${w.count} posts generated on ${w.day}`}
                    />
                  </div>
                  <span className={styles.dayLabel}>{w.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Best Time to Post */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>⏰ Best Times to Post</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>AI Recommended</span>
          </div>

          <div className={styles.timeSlotList}>
            {data.bestTimeSlots.map((slot, idx) => (
              <div key={idx} className={styles.timeSlotItem}>
                <div>
                  <div className={styles.timeDay}>{slot.day}</div>
                  <div className={styles.timeHour}>{slot.time}</div>
                </div>
                <div className={styles.engagementBadge}>{slot.engagement}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Channels & Recent Posts */}
      <div className={styles.dashboardGrid}>
        {/* Recent Content */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>📝 Recent Content Drafts</div>
            <Link href="/drafts" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              View All Drafts →
            </Link>
          </div>

          {data.recentDrafts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No recent drafts. Click "Generate Caption" above to start!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.recentDrafts.map((d) => (
                <div
                  key={d.id}
                  style={{
                    padding: '0.85rem 1rem',
                    background: 'var(--background)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.88rem', color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {d.content}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {new Date(d.createdAt).toLocaleDateString()} • <span style={{ textTransform: 'capitalize', fontWeight: 600, color: d.status === 'scheduled' ? '#059669' : '#d97706' }}>{d.status}</span>
                    </div>
                  </div>
                  <CopyButton text={d.content} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Channel Distribution */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>📱 Social Distribution</div>
            <Link href="/settings" style={{ fontSize: '0.82rem', color: 'var(--primary)' }}>
              Manage Channels
            </Link>
          </div>

          <div className={styles.channelList}>
            {data.channelBreakdown.map((ch) => (
              <div key={ch.name} className={styles.channelItem}>
                <div className={styles.channelHeader}>
                  <span>{ch.name}</span>
                  <span>{ch.percentage}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${ch.percentage}%`, backgroundColor: ch.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <Link
              href="/pricing"
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              ⭐ Current Plan: <strong style={{ textTransform: 'capitalize', marginLeft: '4px' }}>{sub.plan}</strong> (Upgrade)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
