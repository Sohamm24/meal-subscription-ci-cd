import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';

const DEFAULT_PROFILE = {
  dietaryPattern: 'Vegetarian',
  priorities: ['High Protein', 'High Fiber'],
  allergies: ['Avoid Peanuts', 'Excess Sugar'],
  cuisines: ['Maharashtrian', 'Jain', 'Goan'],
};

export default function LandingPage() {
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('tandurust_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_PROFILE;
  });

  useEffect(() => {
    const handleProfileUpdate = () => {
      try {
        const saved = localStorage.getItem('tandurust_user_profile');
        if (saved) setUserProfile(JSON.parse(saved));
      } catch {
        // fallback
      }
    };
    window.addEventListener('tandurust_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('tandurust_profile_updated', handleProfileUpdate);
  }, []);

  const handleNavigateToMeals = () => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
    } else {
      navigate('/meals');
    }
  };

  return (
    <div>
      <main className="page">
        {/* ── HERO SHOWCASE SECTION ── */}
        <section className="hero-section">
          <div className="hero-grid">
            {/* Left Column */}
            <div>
              <h1 className="hero-headline">
                Always checking calories in your food?
              </h1>
              <p className="hero-desc">
                Know exactly what you're eating, with complete nutrition information, macro
                breakdowns, and tailored ingredient transparency.
              </p>
              <div className="hero-cta-group">
                <button onClick={handleNavigateToMeals} className="btn btn-primary btn-lg">
                  <span>Browse Plans</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Featured Thali Preview */}
            <div>
              <div className="hero-dish-card">
                <div className="dish-card-header">
                  <div className="dish-card-title-group">
                    <h3 className="dish-card-title">Light Yummy Dinner Thali</h3>
                    <span className="dish-card-calories">Total · 540 kcal</span>
                  </div>
                  <div className="dish-card-macros-top">
                    <span className="badge badge-violet">
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                        bolt
                      </span>
                      Protein 24g
                    </span>
                    <span className="badge badge-lemon">
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                        eco
                      </span>
                      Fiber 11g
                    </span>
                  </div>
                </div>

                <div className="dish-card-body-grid">
                  {/* Image & Safety Subpanel */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div className="dish-image-wrapper">
                      <img
                        src="https://lh3.googleusercontent.com/aida/AEtjO1WJnve4Z1hl5J4DVcUsIE7MPWVjjif6K0Fg9A5mNmAFI88pX-M2OkGW90KEsx5jQzfw-bO3lLE4NDkp2jpWyireEbSODzhnelx3_6GHgr4QSQ5tWiJ4pkwZ1l3yJnTc7RLffAQs6j_uDuhdQAVpCtPEt63BxumcvBOTC6EEcHmAR3stZtgPVHfa69f6ioUC-6CYAX1nFFqx5OYKfqI_L5AX3eSJ-jIhnqeLUflm4ViMpcO-RgSYCBd7DUI"
                        alt="Light Yummy Dinner Thali"
                      />
                      <div className="dish-image-badge">
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#eab308',
                          }}
                        />
                        <span>Zero Heavy Cream</span>
                      </div>
                    </div>

                    <div className="dish-subpanel">
                      <div className="subpanel-header">
                        <span style={{ color: 'var(--text-secondary)' }}>Allergen Check</span>
                        <span style={{ color: 'var(--secondary)', fontWeight: 800 }}>
                          100% Clean
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        <span className="pill-chip" style={{ fontSize: '11px', padding: '2px 8px' }}>
                          ✓ Nut-Free
                        </span>
                        <span className="pill-chip" style={{ fontSize: '11px', padding: '2px 8px' }}>
                          ✓ Low Sodium
                        </span>
                        <span className="pill-chip" style={{ fontSize: '11px', padding: '2px 8px' }}>
                          ✓ Gut-Healthy
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Portions & Macro Calibration */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div className="dish-subpanel">
                      <div className="subpanel-header">
                        <span style={{ color: 'var(--text-primary)' }}>Meal Breakdown</span>
                        <span style={{ color: 'var(--text-muted)' }}>4 Portions</span>
                      </div>
                      <div className="dish-portion-list">
                        <div className="dish-portion-item">
                          <span style={{ fontWeight: 600 }}>Dal Tadka &amp; Jeera Brown Rice</span>
                          <span style={{ color: 'var(--text-muted)' }}>260 kcal</span>
                        </div>
                        <div className="dish-portion-item">
                          <span style={{ fontWeight: 600 }}>Methi &amp; French Bean Poriyal</span>
                          <span style={{ color: 'var(--text-muted)' }}>90 kcal</span>
                        </div>
                        <div className="dish-portion-item">
                          <span style={{ fontWeight: 600 }}>Fresh Kachumber Salad</span>
                          <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>+55 kcal</span>
                        </div>
                        <div className="dish-portion-item">
                          <span style={{ fontWeight: 600 }}>Cardamom Shrikhand Cup</span>
                          <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>+90 kcal</span>
                        </div>
                      </div>
                    </div>

                    <div className="macro-meter-box">
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          marginBottom: '6px',
                        }}
                      >
                        <span style={{ color: 'var(--text-muted)' }}>MACRO CALIBRATION</span>
                        <span style={{ color: 'var(--text-primary)' }}>540 / 600 kcal Goal</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '11px',
                            }}
                          >
                            <span>Protein (24g)</span>
                            <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>88%</span>
                          </div>
                          <div className="macro-bar-track">
                            <div
                              className="macro-bar-fill"
                              style={{ width: '88%', background: 'var(--secondary)' }}
                            />
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '11px',
                            }}
                          >
                            <span>Fiber (11g)</span>
                            <span style={{ fontWeight: 700, color: 'var(--tertiary-hover)' }}>
                              95%
                            </span>
                          </div>
                          <div className="macro-bar-track">
                            <div
                              className="macro-bar-fill"
                              style={{ width: '95%', background: '#eab308' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ── FOOD PROFILE SHOWCASE SECTION ── */}
        <section className="food-profile-section" id="food-profile">
          <div>
            <h2 className="page-title" style={{ textAlign: 'left', fontSize: '2.25rem' }}>
              Know what works for you
            </h2>
            <p className="hero-desc">
              No two routines or bodies are identical. Tandurust builds each weekly meal cycle
              around your real-world lifestyle: specific food likes, strict allergens, daily calorie
              ceilings, and cuisine tastes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--secondary-container)',
                    color: 'var(--secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '2px',
                  }}
                >
                  ✓
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>
                    Real Calorie Transparency
                  </h4>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--secondary-container)',
                    color: 'var(--secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '2px',
                  }}
                >
                  ✓
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Effortless Customization</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-live-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '1rem',
                marginBottom: '1.25rem',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--secondary)',
                    textTransform: 'uppercase',
                  }}
                >
                  Live Profile Card
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Your Food Profile</h3>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <span className="form-label">DIETARY PATTERN</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span className="pill-chip pill-chip-active">
                    🌿 {userProfile.dietaryPattern || 'Vegetarian'}
                  </span>
                </div>
              </div>

              <div>
                <span className="form-label">NUTRITIONAL PRIORITIES</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(userProfile.priorities && userProfile.priorities.length > 0
                    ? userProfile.priorities
                    : ['High Protein', 'High Fiber']
                  ).map((p: string) => (
                    <span key={p} className="badge badge-lemon" style={{ padding: '6px 12px' }}>
                      ⚡ {p}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="form-label">EXCLUSIONS &amp; SENSITIVITIES</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(userProfile.allergies && userProfile.allergies.length > 0
                    ? userProfile.allergies
                    : ['Avoid Peanuts', 'Excess Sugar']
                  ).map((a: string) => (
                    <span
                      key={a}
                      className="pill-chip"
                      style={{
                        background: 'var(--accent-red-bg)',
                        color: 'var(--accent-red-text)',
                        borderColor: 'rgba(239, 68, 68, 0.2)',
                      }}
                    >
                      ✕ {a}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="form-label">CUISINES &amp; CADENCE</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(userProfile.cuisines && userProfile.cuisines.length > 0
                    ? userProfile.cuisines
                    : ['Maharashtrian', 'Jain', 'Goan']
                  ).map((c: string) => (
                    <span key={c} className="pill-chip">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CALL TO ACTION SECTION ── */}
        <section
          style={{
            background: 'linear-gradient(135deg, var(--bg-subtle) 0%, var(--bg-container-low) 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '4rem 2rem',
            textAlign: 'center',
            margin: '4rem 0 2rem',
            border: '1px solid var(--border)',
          }}
        >
          <div className="hero-tag" style={{ margin: '0 auto 1rem' }}>
            Start Fresh Today
          </div>
          <h2 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Ready to upgrade your daily nutrition?
          </h2>
          <p className="page-subtitle" style={{ marginBottom: '2rem' }}>
            Choose from chef-crafted breakfast, lunch, and dinner plans with calibrated nutrients.
          </p>
          <button onClick={handleNavigateToMeals} className="btn btn-primary btn-lg">
            <span>Explore All Meal Plans</span>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              arrow_forward
            </span>
          </button>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="navbar-logo">
                <div className="navbar-logo-badge">🌿</div>
                <span>Tandurust</span>
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                  }}
                />
                <span>Kitchen &amp; Deliveries Active</span>
              </div>
            </div>

            <div className="footer-links-grid">
              <div>
                <div className="footer-col-title">Explore</div>
                <div className="footer-col-links">
                  <button
                    onClick={handleNavigateToMeals}
                    className="footer-link"
                    style={{ background: 'transparent', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}
                  >
                    Browse Plans
                  </button>
                  <a href="#food-profile" className="footer-link">
                    Meal Selection
                  </a>
                  <a href="#food-profile" className="footer-link">
                    Macro Calibration
                  </a>
                </div>
              </div>

              <div>
                <div className="footer-col-title">Nutrition &amp; Health</div>
                <div className="footer-col-links">
                  <span className="footer-link">Calorie Ceilings</span>
                  <span className="footer-link">Allergen Guard</span>
                  <span className="footer-link">Dietary Profiles</span>
                  <span className="footer-link">Verified Ingredients</span>
                </div>
              </div>

              <div>
                <div className="footer-col-title">Company &amp; Support</div>
                <div className="footer-col-links">
                  <span className="footer-link">About Tandurust</span>
                  <span className="footer-link">Contact Us</span>
                  <span className="footer-link">Privacy Policy</span>
                  <span className="footer-link">Terms of Service</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Tandurust. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
