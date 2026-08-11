import { getProfile, updateProfile } from '@/app/actions/profile';
import styles from './Profile.module.css';

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Practice Profile</h1>
        <p className={styles.subtitle}>Configure your practice details to personalize your AI captions.</p>
      </header>

      <div className="card">
        <form action={updateProfile}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Practice Name</label>
              <input type="text" id="name" name="name" defaultValue={profile.name} placeholder="e.g. Smile Dental" required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="specialty" className={styles.label}>Specialty</label>
              <input type="text" id="specialty" name="specialty" defaultValue={profile.specialty} placeholder="e.g. Orthodontics, Pediatric Dentist" required />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="location" className={styles.label}>Location / City</label>
              <input type="text" id="location" name="location" defaultValue={profile.location} placeholder="e.g. Austin, TX" />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="preferredTopics" className={styles.label}>Preferred Topics</label>
              <input type="text" id="preferredTopics" name="preferredTopics" defaultValue={profile.preferredTopics} placeholder="e.g. Whitening, Invisalign, Patient tips" />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="tone" className={styles.label}>Brand Tone</label>
              <input type="text" id="tone" name="tone" defaultValue={profile.tone} placeholder="e.g. Friendly, professional, fun" />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="voiceSamples" className={styles.label}>Voice Samples (Crucial for AI)</label>
              <p className={styles.subtitle} style={{ fontSize: '0.85rem' }}>Paste past captions, emails, or anything you've written so the AI learns how you sound.</p>
              <textarea id="voiceSamples" name="voiceSamples" className={styles.textarea} defaultValue={profile.voiceSamples} placeholder="Paste your past writing here..."></textarea>
            </div>
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>Save Profile</button>
        </form>
      </div>
    </div>
  );
}
