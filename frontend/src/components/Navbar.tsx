import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/auth';
import logoImg from '../assets/logo.png';

interface UserProfile {
  dietaryPattern: string;
  priorities: string[];
  allergies: string[];
  cuisines: string[];
}

const DEFAULT_PROFILE: UserProfile = {
  dietaryPattern: 'Vegetarian',
  priorities: ['High Protein', 'High Fiber'],
  allergies: ['Avoid Peanuts'],
  cuisines: ['Maharashtrian', 'Jain'],
};

export default function Navbar() {
  const user = getCurrentUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Profile preferences
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('tandurust_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_PROFILE;
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
    window.location.reload();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleArrayItem = (key: 'priorities' | 'allergies' | 'cuisines', value: string) => {
    setProfile((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists ? prev[key].filter((item) => item !== value) : [...prev[key], value],
      };
    });
  };

  const handleSaveProfile = () => {
    try {
      localStorage.setItem('tandurust_user_profile', JSON.stringify(profile));
      window.dispatchEvent(new Event('tandurust_profile_updated'));
    } catch {
      // ignore
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setProfileModalOpen(false);
    }, 900);
  };

  return (
    <>
      <div className="navbar-sticky-wrapper">
        <header className="navbar" role="navigation" aria-label="Main navigation">
        {/* Brand Logo on the Left */}
        <Link to="/" className="navbar-logo">
          <img src={logoImg} alt="Tandurust" className="navbar-logo-img" />
        </Link>

        {/* Right Side: Profile Icon with Dropdown Menu */}
        <div className="navbar-profile-container" ref={dropdownRef}>
          <button
            className="profile-toggle-btn"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-label="User profile menu"
            aria-expanded={dropdownOpen}
          >
            {user ? (
              <div className="user-avatar-circle">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            ) : (
              <span className="material-symbols-outlined profile-icon-symbol">
                account_circle
              </span>
            )}
            <span className="material-symbols-outlined dropdown-arrow-icon">
              {dropdownOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {dropdownOpen && (
            <div className="profile-dropdown-menu animate-up">
              {user ? (
                <>
                  <div className="dropdown-user-header">
                    <div className="dropdown-user-avatar">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <div className="dropdown-user-info">
                      <span className="dropdown-user-name">{user.name}</span>
                      <span className="dropdown-user-email">{user.email}</span>
                    </div>
                  </div>

                  <div className="dropdown-divider" />

                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setDropdownOpen(false);
                      setProfileModalOpen(true);
                    }}
                  >
                    <span className="material-symbols-outlined">tune</span>
                    <span>Change Profile</span>
                  </button>

                  <Link
                    to="/subscriptions"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className="material-symbols-outlined">card_membership</span>
                    <span>My Subscriptions</span>
                  </Link>

                  <div className="dropdown-divider" />

                  <button
                    onClick={handleLogout}
                    className="dropdown-item nav-link-logout dropdown-item-danger"
                  >
                    <span className="material-symbols-outlined">logout</span>
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="dropdown-guest-header">
                    <span className="dropdown-guest-title">Welcome to Tandurust</span>
                    <span className="dropdown-guest-desc">Sign in to manage your meal plans</span>
                  </div>

                  <div className="dropdown-divider" />

                  <Link
                    to="/login"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className="material-symbols-outlined">login</span>
                    <span>Sign In</span>
                  </Link>

                  <Link
                    to="/register"
                    className="dropdown-item dropdown-item-primary"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className="material-symbols-outlined">person_add</span>
                    <span>Get Started</span>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </header>

        {/* Yellow rounded pattern curtain design running left to right */}
        <div className="navbar-curtain-banner" aria-hidden="true">
          <svg
            className="navbar-curtain-svg"
            preserveAspectRatio="none"
            viewBox="0 0 1200 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="yellowCurtainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FACC15" />
                <stop offset="25%" stopColor="#EAB308" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="75%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#FACC15" />
              </linearGradient>
              <pattern
                id="yellowCurtainPattern"
                width="48"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                {/* Top connecting bar */}
                <path d="M 0 0 H 48 V 4 H 0 Z" fill="#EAB308" />
                {/* Main rounded yellow curtain scallop arch */}
                <path
                  d="M 0 4 Q 24 26 48 4 L 48 0 L 0 0 Z"
                  fill="url(#yellowCurtainGrad)"
                />
                {/* Inner lighter yellow highlight arch */}
                <path
                  d="M 6 4 Q 24 20 42 4 Z"
                  fill="#FEF08A"
                  opacity="0.85"
                />
                {/* Center hanging decorative amber bead/dot */}
                <circle cx="24" cy="22" r="2.2" fill="#854D0E" />
              </pattern>
            </defs>
            <rect width="100%" height="24" fill="url(#yellowCurtainPattern)" />
          </svg>
        </div>
      </div>

      {/* ── CHANGE PROFILE MODAL ── */}
      {profileModalOpen && (
        <div
          className="modal-overlay animate-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setProfileModalOpen(false);
          }}
        >
          <div
            className="modal animate-up"
            style={{ maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <h2 id="profile-modal-title" className="modal-title" style={{ margin: 0 }}>
                  Change Food Profile
                </h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Update your dietary preferences, priorities, and allergen exclusions
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setProfileModalOpen(false)}
                style={{ padding: '6px 10px', fontSize: '1.2rem', borderRadius: '50%' }}
              >
                ✕
              </button>
            </div>

            {savedSuccess && (
              <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
                ✓ Profile preferences updated successfully!
              </div>
            )}

            {/* 1. Dietary Pattern */}
            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>
                DIETARY PATTERN
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {['Vegetarian', 'Vegan', 'Eggetarian', 'Non-Vegetarian'].map((pat) => (
                  <button
                    key={pat}
                    type="button"
                    onClick={() => setProfile((p) => ({ ...p, dietaryPattern: pat }))}
                    className={`preference-pill-btn ${
                      profile.dietaryPattern === pat ? 'active' : ''
                    }`}
                  >
                    <span>
                      {pat === 'Vegetarian'
                        ? '🌿'
                        : pat === 'Vegan'
                        ? '🌱'
                        : pat === 'Eggetarian'
                        ? '🥚'
                        : '🍗'}
                    </span>
                    <span>{pat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Nutritional Priorities */}
            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>
                NUTRITIONAL PRIORITIES
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {[
                  { label: 'High Protein', icon: '⚡' },
                  { label: 'High Fiber', icon: '🌾' },
                  { label: 'Gut Health Focused', icon: '✨' },
                  { label: 'Low Carb', icon: '🥑' },
                  { label: 'Weight Management', icon: '⚖️' },
                ].map((item) => {
                  const active = profile.priorities.includes(item.label);
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

            {/* 3. Sensitivities & Allergens */}
            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>
                ALLERGIES &amp; EXCLUSIONS
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
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
                  const active = profile.allergies.includes(allergy);
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

            {/* 4. Preferred Regional Cuisines */}
            <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>
                PREFERRED REGIONAL CUISINES
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Maharashtrian', 'Jain', 'Goan', 'South Indian', 'North Indian', 'Mediterranean'].map(
                  (cuisine) => {
                    const active = profile.cuisines.includes(cuisine);
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

            {/* Footer buttons */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setProfileModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveProfile}
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}