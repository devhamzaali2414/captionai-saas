import GeneratorForm from '@/components/GeneratorForm';
import styles from '../Generate.module.css';

export default function GeneratePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>✨ AI Caption Generator</h1>
        <p className={styles.subtitle}>
          Generate stunning, personalized captions tailored to your practice in seconds.
        </p>
      </header>

      <div className={`card ${styles.card}`}>
        <GeneratorForm />
      </div>
    </div>
  );
}
