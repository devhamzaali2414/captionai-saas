import { getProfile, savePostizApiKey } from '@/app/actions/profile';
import { getPostizIntegrations } from '@/app/actions/postiz';
import SubmitButton from '@/components/SubmitButton';
import styles from './Settings.module.css';

export default async function SettingsPage() {
  const profile = await getProfile();
  const integrations = await getPostizIntegrations();
  const apiKey = profile?.postizApiKey || process.env.BUFFER_API_KEY || '';
  const hasKey = Boolean(apiKey);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>⚙️ Settings & Social Channels</h1>
        <p className={styles.subtitle}>
          Manage your automated social media publishing accounts (Buffer & Meta integration).
        </p>
      </header>

      {/* Social Media API Key Integration */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.25rem', fontSize: '1.3rem', fontWeight: 700 }}>
              📱 Buffer Social Media Integration
            </h2>
            <p className={styles.subtitle}>
              Connect Buffer's API to auto-publish captions and visuals directly to Instagram, Facebook, LinkedIn, X, and Pinterest.
            </p>
          </div>

          <a
            href="https://publish.buffer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <span>Open Buffer Dashboard</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>

        <form action={savePostizApiKey}>
          <div className={styles.formGroup} style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="postizApiKey" className={styles.label}>
              Buffer / Social Publishing API Key
            </label>
            <input 
              type="password" 
              id="postizApiKey" 
              name="postizApiKey" 
              className={styles.input}
              defaultValue={apiKey} 
              placeholder="Paste your Buffer API Key (e.g. tch0...)" 
              required
            />
          </div>
          <SubmitButton className="btn btn-primary">
            {hasKey ? '✓ Update API Key' : 'Save & Connect Buffer'}
          </SubmitButton>
        </form>
      </div>

      {/* Connected Accounts Card */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Connected Social Media Channels
            </h2>
            <p className={styles.subtitle}>
              {hasKey 
                ? 'Your active publishing channels discovered from Buffer' 
                : 'Demo channels active — add your Buffer API key above for live channels.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {integrations.map((channel: any) => (
            <div
              key={channel.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.1rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--background)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: channel.provider === 'instagram' ? '#e1306c' : 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '0.85rem'
                  }}
                >
                  {channel.provider === 'instagram' ? '📸' : (channel.provider || 'S').slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--foreground)' }}>
                    {channel.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {channel.provider} channel
                  </div>
                </div>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#059669',
                  backgroundColor: '#d1fae5',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '9999px'
                }}
              >
                ● Connected
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
