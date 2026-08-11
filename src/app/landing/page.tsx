import Link from 'next/link';
import styles from './Landing.module.css';

export default function LandingPage() {
  return (
    <div className={styles.landingWrapper}>
      {/* Sticky Header Navbar */}
      <header className={styles.navbar}>
        <div className={`${styles.container} ${styles.navContainer}`}>
          <Link href="/landing" className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span>CaptionAI</span>
          </Link>

          <ul className={styles.navLinks}>
            <li><a href="#features" className={styles.navLink}>Features</a></li>
            <li><a href="#how-it-works" className={styles.navLink}>How It Works</a></li>
            <li><a href="#testimonials" className={styles.navLink}>Testimonials</a></li>
            <li><Link href="/pricing" className={styles.navLink}>Pricing</Link></li>
            <li><a href="#faq" className={styles.navLink}>FAQ</a></li>
          </ul>

          <div className={styles.navActions}>
            <Link href="/login" className={styles.signInBtn}>Sign In</Link>
            <Link href="/signup" className={styles.ctaBtnPrimary}>
              Start Free Trial →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGlow}></div>
        <div className={styles.container}>
          <div className={styles.badge}>
            <span>✨ AI-Powered Practice Growth • Trusted by 250+ Clinics</span>
          </div>

          <h1 className={styles.heroTitle}>
            Automate Your Clinic's Social Media <br />
            <span className={styles.gradientText}>In Under 60 Seconds</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Generate high-converting medical & dental captions, generate clinical visuals, and auto-schedule a full 30-day calendar directly to Instagram & Meta on autopilot.
          </p>

          <div className={styles.heroButtons}>
            <Link href="/signup" className={styles.ctaBtnPrimary} style={{ padding: '0.85rem 1.85rem', fontSize: '1rem' }}>
              🚀 Start Free Trial (No Card Needed)
            </Link>
            <Link href="/dashboard" className={styles.demoBtn} style={{ padding: '0.85rem 1.6rem', fontSize: '1rem' }}>
              ⚡ Live Interactive Demo
            </Link>
          </div>

          <div className={styles.socialProof}>
            <span className={styles.stars}>★★★★★</span>
            <span><strong>4.9/5 Rating</strong> from 300+ Dentists, Orthodontists & Aesthetic Doctors</span>
          </div>

          {/* Product Preview Mockup */}
          <div className={styles.previewSection}>
            <div className={styles.previewFrame}>
              <div className={styles.previewInner}>
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&auto=format&fit=crop&q=80"
                  alt="CaptionAI Practice Dashboard"
                  style={{ maxHeight: '480px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Major Features Grid */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Everything Your Practice Needs to Dominate Social Media</h2>
            <p className={styles.sectionSubtitle}>
              Built specifically for healthcare professionals, dental clinics, and aesthetic practices.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🪄</div>
              <h3 className={styles.featureTitle}>AI Captions Tailored to Your Voice</h3>
              <p className={styles.featureDesc}>
                Trained on dental & medical clinical knowledge. Captions sound exactly like your doctor's authentic tone.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🗓️</div>
              <h3 className={styles.featureTitle}>1-Click 30-Day Calendar Engine</h3>
              <p className={styles.featureDesc}>
                Click one button to generate 30 days of balanced educational tips, promos, mythbusters, and patient stories.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎨</div>
              <h3 className={styles.featureTitle}>Instant AI Clinical Visuals</h3>
              <p className={styles.featureDesc}>
                Generate modern clinic aesthetics, smile transformations, and doctor advice graphics in 1 click.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📱</div>
              <h3 className={styles.featureTitle}>Direct Instagram & Social Auto-Posting</h3>
              <p className={styles.featureDesc}>
                Integrated with Buffer and Meta APIs for 100% direct cloud auto-publishing while you sleep.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎙️</div>
              <h3 className={styles.featureTitle}>Voice-to-Caption Dictation</h3>
              <p className={styles.featureDesc}>
                Just speak for 20 seconds about a patient case or update, and AI turns your voice into ready-to-post captions.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🏢</div>
              <h3 className={styles.featureTitle}>Multi-Clinic & Branch Management</h3>
              <p className={styles.featureDesc}>
                Manage multiple practice locations, branches, or doctors under a single unified dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section id="how-it-works" className={styles.stepsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>3 Simple Steps to Social Media Autopilot</h2>
            <p className={styles.sectionSubtitle}>
              Save 15+ hours every month on content creation and social management.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>01</div>
              <h3 className={styles.featureTitle}>Set Practice Tone & Specialty</h3>
              <p className={styles.featureDesc}>
                Enter your practice name, specialty, and clinic updates. AI immediately learns your unique brand voice.
              </p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>02</div>
              <h3 className={styles.featureTitle}>Generate 30 Days in 1 Click</h3>
              <p className={styles.featureDesc}>
                Choose your posting frequency and hit generate. 30 high-converting captions and visuals are created instantly.
              </p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>03</div>
              <h3 className={styles.featureTitle}>Auto-Publish & Track Growth</h3>
              <p className={styles.featureDesc}>
                Posts are queued into Buffer and auto-published to Instagram, Facebook, and LinkedIn automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Testimonials */}
      <section id="testimonials" className={styles.testimonialsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Loved by Fast-Growing Practices</h2>
            <p className={styles.sectionSubtitle}>
              Here is how doctors and clinic managers are growing their patient base with CaptionAI.
            </p>
          </div>

          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <p className={styles.testimonialQuote}>
                "CaptionAI has replaced our expensive $1,500/mo social agency. The 30-Day Batch Planner schedules our entire month of cosmetic dentistry content in literally 5 minutes!"
              </p>
              <div className={styles.doctorProfile}>
                <div className={styles.doctorAvatar}>DA</div>
                <div>
                  <div className={styles.doctorName}>Dr. Ahmad Raza</div>
                  <div className={styles.doctorRole}>Cosmetic Dentist • Apex Smile Clinic</div>
                </div>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <p className={styles.testimonialQuote}>
                "The Voice-to-Caption feature is incredible. After seeing a patient, I dictate a 15-second note on my phone and CaptionAI generates 3 educational Instagram posts immediately."
              </p>
              <div className={styles.doctorProfile}>
                <div className={styles.doctorAvatar}>SK</div>
                <div>
                  <div className={styles.doctorName}>Dr. Sarah Khan</div>
                  <div className={styles.doctorRole}>Orthodontist • ClearSmile Braces</div>
                </div>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <p className={styles.testimonialQuote}>
                "Direct auto-publishing to Instagram with Buffer integration works flawlessly. We've seen a 40% increase in direct message patient bookings since using CaptionAI."
              </p>
              <div className={styles.doctorProfile}>
                <div className={styles.doctorAvatar}>FM</div>
                <div>
                  <div className={styles.doctorName}>Dr. Farhan Malik</div>
                  <div className={styles.doctorRole}>Director • Elite Aesthetics & Skin</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p className={styles.sectionSubtitle}>Everything you need to know about CaptionAI.</p>
          </div>

          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h4 className={styles.faqQuestion}>Does CaptionAI post directly to Instagram automatically?</h4>
              <p className={styles.faqAnswer}>
                Yes! With our Buffer and Meta API integration, scheduled posts are automatically published directly to your Instagram Professional/Creator profile and Facebook page on schedule.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h4 className={styles.faqQuestion}>Can I edit captions or change attached images before they post?</h4>
              <p className={styles.faqAnswer}>
                Absolutely. You have full control. You can edit text, generate AI hashtags, swap images, or preview posts in the simulated phone feed mockup at any time.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h4 className={styles.faqQuestion}>Do I need marketing experience to use this?</h4>
              <p className={styles.faqAnswer}>
                None at all. CaptionAI is built specifically for healthcare clinicians and staff. Just select your specialty, and the AI handles the medical accuracy, copywriting, and hashtags.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h4 className={styles.faqQuestion}>Is there a free trial?</h4>
              <p className={styles.faqAnswer}>
                Yes, our Starter plan is 100% free with 25 AI captions every month. No credit card is required to sign up!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Conversion CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Put Your Practice Social Media on Autopilot Today</h2>
          <p className={styles.heroSubtitle} style={{ marginBottom: '2rem' }}>
            Join hundreds of doctors and dental practices growing their brands with AI.
          </p>
          <Link href="/signup" className={styles.ctaBtnPrimary} style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}>
            🚀 Get Started Free in 30 Seconds
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          © 2026 CaptionAI. All rights reserved. Built for modern healthcare & dental practices.
        </div>
      </footer>
    </div>
  );
}
