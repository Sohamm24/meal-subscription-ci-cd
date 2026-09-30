import { User, MealPlan, Subscription, AdminStats, MealPlanInput, SubscriptionStatus } from './types';

// Preset credentials and initial mock dataset
export const initialUsers: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: 2,
    name: 'John Customer',
    email: 'customer@gmail.com',
    password: 'customer123',
    role: 'customer',
  },
];

export const initialMealPlans: MealPlan[] = [
  {
    id: 1,
    name: 'Keto Supreme Meal Plan',
    description: 'Low carb, healthy fats & high nutrition meals crafted to keep you in peak ketosis.',
    price: 1499,
    status: 'active',
    meal_type: 'dinner',
  },
  {
    id: 2,
    name: 'Vegetarian Balanced Diet',
    description: 'Nutrient-rich, farm-fresh organic plant-based meals prepared daily by expert chefs.',
    price: 1199,
    status: 'active',
    meal_type: 'lunch',
  },
  {
    id: 3,
    name: 'High-Protein Fitness Feast',
    description: 'Lean protein dishes with optimal macro balance designed for strength and recovery.',
    price: 1799,
    status: 'active',
    meal_type: 'dinner',
  },
  {
    id: 4,
    name: 'Artisan Low-Calorie Breakfast',
    description: 'Wholesome breakfast bowls, cold-pressed juices, and protein oats under 400 calories.',
    price: 899,
    status: 'active',
    meal_type: 'breakfast',
  },
  {
    id: 5,
    name: 'Gourmet Mediterranean Delight',
    description: 'Heart-healthy culinary experience packed with extra virgin olive oil, herbs, and greens.',
    price: 1999,
    status: 'active',
    meal_type: 'dinner',
  },
];

export const initialSubscriptions: Subscription[] = [
  {
    id: 1,
    customer_id: 2,
    meal_plan_id: 1,
    status: 'active',
    created_at: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 2,
    customer_id: 2,
    meal_plan_id: 4,
    status: 'paused',
    created_at: '2026-03-05T14:30:00.000Z',
  },
];

// In-memory runtime data store (no database)
class DataStore {
  private users: User[] = [...initialUsers];
  private mealPlans: MealPlan[] = [...initialMealPlans];
  private subscriptions: Subscription[] = [...initialSubscriptions];
  private nextUserId = 3;
  private nextMealPlanId = 6;
  private nextSubId = 3;

  findUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  findUserById(id: number): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  createUser(user: Omit<User, 'id'>): User {
    const newUser: User = {
      ...user,
      id: this.nextUserId++,
    };
    this.users.push(newUser);
    return newUser;
  }

  getAllUsers(): User[] {
    return [...this.users];
  }

  getAllMealPlans(): MealPlan[] {
    return [...this.mealPlans];
  }

  getMealPlanById(id: number): MealPlan | undefined {
    return this.mealPlans.find((m) => m.id === id);
  }

  createMealPlan(input: MealPlanInput): MealPlan {
    const newPlan: MealPlan = {
      ...input,
      id: this.nextMealPlanId++,
    };
    this.mealPlans.unshift(newPlan);
    return newPlan;
  }

  updateMealPlan(id: number, input: MealPlanInput): MealPlan | undefined {
    const index = this.mealPlans.findIndex((m) => m.id === id);
    if (index === -1) return undefined;

    const updated: MealPlan = {
      ...input,
      id,
    };
    this.mealPlans[index] = updated;
    return updated;
  }

  deleteMealPlan(id: number): boolean {
    const index = this.mealPlans.findIndex((m) => m.id === id);
    if (index === -1) return false;
    this.mealPlans.splice(index, 1);
    return true;
  }

  private populateSubscription(sub: Subscription): Subscription {
    const meal_plan = this.getMealPlanById(sub.meal_plan_id);
    return {
      ...sub,
      meal_plan,
    };
  }

  getSubscriptionsByCustomer(customerId: number): Subscription[] {
    return this.subscriptions
      .filter((s) => s.customer_id === customerId)
      .map((s) => this.populateSubscription(s));
  }

  getAllSubscriptions(): Subscription[] {
    return this.subscriptions.map((s) => this.populateSubscription(s));
  }

  createSubscription(customerId: number, mealPlanId: number): Subscription {
    const newSub: Subscription = {
      id: this.nextSubId++,
      customer_id: customerId,
      meal_plan_id: mealPlanId,
      status: 'active',
      created_at: new Date().toISOString(),
    };
    this.subscriptions.unshift(newSub);
    return this.populateSubscription(newSub);
  }

  updateSubscriptionStatus(id: number, status: SubscriptionStatus): Subscription | undefined {
    const sub = this.subscriptions.find((s) => s.id === id);
    if (!sub) return undefined;
    sub.status = status;
    return this.populateSubscription(sub);
  }

  getAdminStats(): AdminStats {
    const customers = this.users.filter((u) => u.role === 'customer').length;
    const activeSubs = this.subscriptions.filter((s) => s.status === 'active').length;
    const totalPlans = this.mealPlans.length;
    return {
      total_customers: customers,
      active_subscriptions: activeSubs,
      total_meal_plans: totalPlans,
    };
  }
}

export const db = new DataStore();
