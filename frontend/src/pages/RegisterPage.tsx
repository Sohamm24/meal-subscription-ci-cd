import { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/auth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Onboarding Preferences State
  const [preferences, setPreferences] = useState({
    dietaryPattern: 'Vegetarian',
    priorities: ['High Protein', 'High Fiber'] as string[],
    allergies: ['Avoid Peanuts'] as string[],
    cuisines: ['Maharashtrian', 'Jain'] as string[],
    cadence: '3 Meals / Day',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const toggleArrayItem = (key: 'priorities' | 'allergies' | 'cuisines', value: string) => {
    setPreferences((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists ? prev[key].filter((item) => item !== value) : [...prev[key], value],
      };
    });
  };

  const handleStep1Submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await registerUser(form.name, form.email, form.password, 'customer');
      // Transition to Onboarding steps
      setLoading(false);
      setStep(2);
    } catch (caught) {
      setLoading(false);
      setError(caught instanceof Error ? caught.message : 'Registration failed');
    }
  };

  const handleFinishOnboarding = () => {
    try {
      localStorage.setItem('tandurust_user_profile', JSON.stringify(preferences));
    } catch {
      // ignore localstorage errors
    }
    navigate('/meals');
    window.location.reload();
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide animate-up">
        {/* Brand Header */}
        <div className="auth-logo">
          <div className="navbar-logo-badge">🌿</div>
          <span>Tandurust</span>
        </div>

        {/* Multi-step progress bar */}
        <div className="onboarding-progress-bar-container">
          <div className="onboarding-steps-indicator">
            <span className="onboarding-step-label">
              {step === 1 && 'Step 1: Account Creation'}
              {step === 2 && 'Step 2: Dietary Preferences'}
              {step === 3 && 'Step 3: Sensitivities & Allergens'}
              {step === 4 && 'Step 4: Regional Cuisines & Cadence'}
            </span>
            <span className="onboarding-step-count">{step} of 4</span>
          </div>
          <div className="onboarding-progress-track">
            <div
              className="onboarding-progress-fill"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        {/* ── STEP 1: INITIAL REGISTRATION ── */}
        {step === 1 && (
          <div>
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">Join health-conscious eaters enjoying calibrated meals</p>

            <form onSubmit={handleStep1Submit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">
                  Full name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  className="form-input"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={set('name')}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">
                  Email address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set('email')}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">
                  Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  className="form-input"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={set('password')}
                  required
                  autoComplete="new-password"
                />
              </div>

              <button
                id="reg-submit"
                type="submit"
                className="btn btn-primary btn-lg btn-full"
                disabled={loading}
                style={{ marginTop: '0.75rem' }}
              >
                {loading ? (
                  <>
                    <span className="spinner" /> Creating account…
                  </>
                ) : (
                  'Continue to Food Profile →'
                )}
              </button>
            </form>

            <p className="auth-footer">
              Already have an account?{' '}
              <Link to="/login" className="link">
                Sign in
              </Link>
            </p>
          </div>
        )}

        {/* ── STEP 2: DIETARY PATTERN & PRIORITIES ── */}
        {step === 2 && (
          <div className="animate-in">
            <h1 className="auth-title">Your Dietary Preferences</h1>
            <p className="auth-subtitle">
              How do you like your meals calibrated? We'll curate your dishes accordingly.
            </p>

            <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ marginBottom: '0.65rem' }}>
                DIETARY PATTERN
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                {['Vegetarian', 'Vegan', 'Eggetarian', 'Non-Vegetarian'].map((pat) => (
                  <button
                    key={pat}
                    type="button"
                    onClick={() => setPreferences((p) => ({ ...p, dietaryPattern: pat }))}
                    className={`preference-pill-btn ${
                      preferences.dietaryPattern === pat ? 'active' : ''
                    }`}
                  >
                    <span>{pat === 'Vegetarian' ? '🌿' : pat === 'Vegan' ? '🌱' : pat === 'Eggetarian' ? '🥚' : '🍗'}</span>
                    <span>{pat}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'left', marginBottom: '1.75rem' }}>
              <label className="form-label" style={{ marginBottom: '0.65rem' }}>
                NUTRITIONAL PRIORITIES (SELECT MULTIPLE)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {[
                  { label: 'High Protein', icon: '⚡' },
                  { label: 'High Fiber', icon: '🌾' },
                  { label: 'Gut Health Focused', icon: '✨' },
                  { label: 'Low Carb', icon: '🥑' },
                  { label: 'Weight Management', icon: '⚖️' },
                ].map((item) => {
                  const active = preferences.priorities.includes(item.label);
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => toggleArrayItem('priorities', item.label)}
                      className={`preference-chip-btn ${active ? 'active' : ''}`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-full"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary btn-full"
                onClick={() => setStep(3)}
              >
                Next: Sensitivities →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: EXCLUSIONS & ALLERGENS ── */}
        {step === 3 && (
          <div className="animate-in">
            <h1 className="auth-title">Allergies &amp; Exclusions</h1>
            <p className="auth-subtitle">
              We strictly exclude these ingredients and cross-verify with our kitchen team.
            </p>

            <div style={{ textAlign: 'left', marginBottom: '1.75rem' }}>
              <label className="form-label" style={{ marginBottom: '0.65rem' }}>
                SELECT INGREDIENTS TO AVOID
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                {[
                  'Avoid Peanuts',
                  'Excess Sugar',
                  'Dairy-Free',
                  'Gluten-Free',
                  'Low Sodium',
                  'No Garlic / Onion',
                  'Soy-Free',
                  'Nightshades Free',
                ].map((allergy) => {
                  const active = preferences.allergies.includes(allergy);
                  return (
                    <button
                      key={allergy}
                      type="button"
                      onClick={() => toggleArrayItem('allergies', allergy)}
                      className={`allergy-chip-btn ${active ? 'active' : ''}`}
                    >
                      <span>{active ? '✕' : '+'}</span>
                      <span>{allergy}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-full"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary btn-full"
                onClick={() => setStep(4)}
              >
                Next: Cuisines →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: REGIONAL CUISINES & CADENCE ── */}
        {step === 4 && (
          <div className="animate-in">
            <h1 className="auth-title">Cuisines &amp; Routine</h1>
            <p className="auth-subtitle">
              Personalize your favorite regional flavors and weekly delivery routine.
            </p>

            <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ marginBottom: '0.65rem' }}>
                PREFERRED REGIONAL CUISINES
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Maharashtrian', 'Jain', 'Goan', 'South Indian', 'North Indian', 'Mediterranean'].map(
                  (cuisine) => {
                    const active = preferences.cuisines.includes(cuisine);
                    return (
                      <button
                        key={cuisine}
                        type="button"
                        onClick={() => toggleArrayItem('cuisines', cuisine)}
                        className={`preference-chip-btn ${active ? 'active' : ''}`}
                      >
                        <span>{active ? '✓' : '+'}</span>
                        <span>{cuisine}</span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>



            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-full"
                onClick={() => setStep(3)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary btn-full"
                onClick={handleFinishOnboarding}
              >
                ✦ Complete &amp; View Plans
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}