export type MealPlanStatus = 'active' | 'inactive';
export type MealType = 'breakfast' | 'lunch' | 'dinner';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

export interface MealPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  status: MealPlanStatus;
  meal_type: MealType;
}

export interface Subscription {
  id: number;
  customer_id: number;
  meal_plan_id: number;
  status: SubscriptionStatus;
  created_at: string;
  meal_plan?: MealPlan;
}

export interface AdminStats {
  total_customers: number;
  active_subscriptions: number;
  total_meal_plans: number;
}

export interface MealPlanInput {
  name: string;
  description: string;
  price: number;
  status: MealPlanStatus;
  meal_type: MealType;
}

export const formatPrice = (price: number): string => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(Number(price));

// In local dev and the Docker test stack, VITE_API_URL is unset
// and requests fall back to '/api' (proxied by Nginx to the backend
// container — identical to today). In Vercel production, set:
//   VITE_API_URL=https://meal-subscribtion-portal.onrender.com/api
const BASE = (import.meta.env?.VITE_API_URL as string | undefined) ?? '/api';

const headers = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
};

const handle = async <T>(res: Response): Promise<T | null> => {
  if (res.status === 204) return null;
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
};

export const getMealPlans = (): Promise<MealPlan[]> => fetch(`${BASE}/meal-plans`, { headers: headers() }).then((res) => handle<MealPlan[]>(res) as Promise<MealPlan[]>);
export const createMealPlan = (data: MealPlanInput): Promise<MealPlan> => fetch(`${BASE}/meal-plans`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then((res) => handle<MealPlan>(res) as Promise<MealPlan>);
export const updateMealPlan = (id: number, data: MealPlanInput): Promise<MealPlan> => fetch(`${BASE}/meal-plans/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then((res) => handle<MealPlan>(res) as Promise<MealPlan>);
export const deleteMealPlan = (id: number): Promise<null> => fetch(`${BASE}/meal-plans/${id}`, { method: 'DELETE', headers: headers() }).then((res) => handle<null>(res) as Promise<null>);
export const getMySubscriptions = (): Promise<Subscription[]> => fetch(`${BASE}/subscriptions`, { headers: headers() }).then((res) => handle<Subscription[]>(res) as Promise<Subscription[]>);
export const subscribe = (mealPlanId: number): Promise<Subscription> => fetch(`${BASE}/subscriptions`, { method: 'POST', headers: headers(), body: JSON.stringify({ meal_plan_id: mealPlanId }) }).then((res) => handle<Subscription>(res) as Promise<Subscription>);
export const updateSubscriptionStatus = (id: number, status: SubscriptionStatus): Promise<{ status: SubscriptionStatus }> => fetch(`${BASE}/subscriptions/${id}/status`, { method: 'PUT', headers: headers(), body: JSON.stringify({ status }) }).then((res) => handle<{ status: SubscriptionStatus }>(res) as Promise<{ status: SubscriptionStatus }>);
export const getAllSubscriptions = (): Promise<Subscription[]> => fetch(`${BASE}/admin/subscriptions`, { headers: headers() }).then((res) => handle<Subscription[]>(res) as Promise<Subscription[]>);
export const getAdminStats = (): Promise<AdminStats> => fetch(`${BASE}/admin/stats`, { headers: headers() }).then((res) => handle<AdminStats>(res) as Promise<AdminStats>);