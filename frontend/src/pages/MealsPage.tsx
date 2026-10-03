import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, getMealPlans, MealPlan, subscribe } from '../services/api';

interface Message {
  type: 'error' | 'success';
  text: string;
}

export default function MealsPage() {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<number | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    getMealPlans()
      .then((data) => setPlans(data || []))
      .catch((err: unknown) =>
        setMessage({
          type: 'error',
          text: err instanceof Error ? err.message : 'Unable to load meal plans',
        })
      )
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (plan: MealPlan) => {
    setMessage(null);
    setSubscribing(plan.id);
    try {
      await subscribe(plan.id);
      setMessage({
        type: 'success',
        text: `🎉 You've subscribed to "${plan.name}"! View it in My Subscriptions.`,
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Subscription failed',
      });
    } finally {
      setSubscribing(null);
    }
  };

  const activePlans = plans.filter((plan) => plan.status === 'active');
  const filteredPlans =
    selectedType === 'all'
      ? activePlans
      : activePlans.filter(
          (plan) => (plan.meal_type || 'dinner').toLowerCase() === selectedType.toLowerCase()
        );

  return (
    <main className="page">
      <header className="page-header" style={{ marginBottom: '2rem' }}>
        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.6rem',
            flexWrap: 'wrap',
          }}
        >
          {['all', 'breakfast', 'lunch', 'dinner'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`pill-chip ${selectedType === type ? 'pill-chip-active' : ''}`}
              style={{ textTransform: 'capitalize', cursor: 'pointer', padding: '8px 22px', fontSize: '0.875rem' }}
            >
              {type === 'all' ? 'All Plans' : type}
            </button>
          ))}
        </div>
      </header>

      {message && (
        <div className={`alert alert-${message.type}`} role="alert" style={{ maxWidth: '840px', margin: '0 auto 2rem' }}>
          <span>{message.text}</span>
          {message.type === 'success' && (
            <Link
              to="/subscriptions"
              className="link"
              style={{ marginLeft: '0.5rem', textDecoration: 'underline' }}
            >
              Go to My Subscriptions →
            </Link>
          )}
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner" />
          <span>Loading meal plans…</span>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="empty-state" style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div className="empty-icon">🍽️</div>
          <h2 className="empty-title">No meal plans found</h2>
          <p className="empty-desc">
            {selectedType !== 'all'
              ? `No ${selectedType} plans currently available. Try selecting 'All Plans'.`
              : 'Check back soon — new plans are added regularly.'}
          </p>
        </div>
      ) : (
        <div className="meals-vertical-list">
          {filteredPlans.map((plan, i) => (
            <article
              key={plan.id}
              className="meal-plan-card meal-plan-row-card animate-up"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="meal-card-main-info">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.65rem',
                  }}
                >
                  <span className={`badge badge-${plan.status}`}>{plan.status}</span>
                  <span
                    className="badge badge-violet"
                    style={{ fontSize: '11px', textTransform: 'uppercase' }}
                  >
                    {plan.meal_type || 'Custom Plan'}
                  </span>
                </div>

                <h2 className="meal-plan-name">{plan.name}</h2>
                <p className="meal-plan-desc">{plan.description}</p>

                <div className="meal-plan-features" style={{ marginTop: '0.75rem' }}>
                  <span className="pill-chip" style={{ fontSize: '11px' }}>
                    ✓ Calorie Balanced
                  </span>
                  <span className="pill-chip" style={{ fontSize: '11px' }}>
                    ✓ High Protein Option
                  </span>
                  <span className="pill-chip" style={{ fontSize: '11px' }}>
                    ✓ Fresh Daily Delivery
                  </span>
                </div>
              </div>

              <div className="meal-card-side-action">
                <div className="meal-plan-price">
                  {formatPrice(plan.price)}
                  <span> / week</span>
                </div>

                <button
                  id={`subscribe-btn-${plan.id}`}
                  className="btn btn-primary btn-full"
                  onClick={() => handleSubscribe(plan)}
                  disabled={subscribing === plan.id}
                  style={{ minWidth: '170px' }}
                >
                  {subscribing === plan.id ? (
                    <>
                      <span className="spinner" /> Subscribing…
                    </>
                  ) : (
                    '✦ Subscribe Now'
                  )}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
