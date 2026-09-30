export type UserRole = 'admin' | 'customer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

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

export interface MealPlanInput {
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
