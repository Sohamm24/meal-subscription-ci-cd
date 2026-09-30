import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { db } from './data';
import { User, MealPlanInput, SubscriptionStatus, UserRole } from './types';

const app = new Hono();

// Global CORS & middleware configuration
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 86400,
  })
);

function generateToken(user: User): string {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    iat: Date.now(),
  };
  return btoa(JSON.stringify(payload));
}

function parseToken(authHeader?: string): { id: number; email: string; role: UserRole } | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  try {
    const payload = JSON.parse(atob(token));
    return payload;
  } catch {
    return null;
  }
}

// Sub-router for all API endpoints
const api = new Hono();

api.get('/', (c) => {
  return c.json({
    status: 'ok',
    service: 'Meal Subscription API',
    timestamp: new Date().toISOString(),
  });
});

api.get('/health', (c) => {
  return c.json({ status: 'healthy' });
});

api.post('/auth/login', async (c) => {
  try {
    const body = await c.req.json<{ email?: string; password?: string }>();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const user = db.findUserByEmail(email);
    if (!user || user.password !== password) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return c.json({
      user: userWithoutPassword,
      token,
    });
  } catch {
    return c.json({ error: 'Malformed JSON payload' }, 400);
  }
});

api.post('/auth/register', async (c) => {
  try {
    const body = await c.req.json<{ name?: string; email?: string; password?: string; role?: UserRole }>();
    const { name, email, password, role = 'customer' } = body;

    if (!name || !email || !password) {
      return c.json({ error: 'Name, email, and password are required' }, 400);
    }

    if (password.length < 6) {
      return c.json({ error: 'Password must be at least 6 characters' }, 400);
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return c.json({ error: 'An account with this email already exists' }, 409);
    }

    const newUser = db.createUser({
      name,
      email,
      password,
      role: role === 'admin' ? 'admin' : 'customer',
    });

    const token = generateToken(newUser);
    const { password: _, ...userWithoutPassword } = newUser;

    return c.json(
      {
        user: userWithoutPassword,
        token,
      },
      201
    );
  } catch {
    return c.json({ error: 'Malformed JSON payload' }, 400);
  }
});

api.get('/meal-plans', (c) => {
  const plans = db.getAllMealPlans();
  return c.json(plans);
});

api.post('/meal-plans', async (c) => {
  try {
    const body = await c.req.json<MealPlanInput>();
    if (!body.name || !body.price) {
      return c.json({ error: 'Plan name and price are required' }, 400);
    }

    const created = db.createMealPlan({
      name: body.name,
      description: body.description || '',
      price: Number(body.price),
      status: body.status || 'active',
      meal_type: body.meal_type || 'dinner',
    });

    return c.json(created, 201);
  } catch {
    return c.json({ error: 'Invalid meal plan data' }, 400);
  }
});

api.put('/meal-plans/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ error: 'Invalid meal plan ID' }, 400);

    const body = await c.req.json<MealPlanInput>();
    const updated = db.updateMealPlan(id, {
      name: body.name,
      description: body.description || '',
      price: Number(body.price),
      status: body.status || 'active',
      meal_type: body.meal_type || 'dinner',
    });

    if (!updated) {
      return c.json({ error: 'Meal plan not found' }, 404);
    }

    return c.json(updated);
  } catch {
    return c.json({ error: 'Invalid meal plan data' }, 400);
  }
});

api.delete('/meal-plans/:id', (c) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) return c.json({ error: 'Invalid meal plan ID' }, 400);

  const deleted = db.deleteMealPlan(id);
  if (!deleted) {
    return c.json({ error: 'Meal plan not found' }, 404);
  }

  return c.body(null, 204);
});

api.get('/subscriptions', (c) => {
  const auth = parseToken(c.req.header('Authorization'));
  const customerId = auth?.id ?? 2;
  const subs = db.getSubscriptionsByCustomer(customerId);
  return c.json(subs);
});

api.post('/subscriptions', async (c) => {
  try {
    const auth = parseToken(c.req.header('Authorization'));
    const customerId = auth?.id ?? 2;

    const body = await c.req.json<{ meal_plan_id?: number }>();
    const mealPlanId = Number(body.meal_plan_id);

    if (!mealPlanId || isNaN(mealPlanId)) {
      return c.json({ error: 'meal_plan_id is required' }, 400);
    }

    const plan = db.getMealPlanById(mealPlanId);
    if (!plan) {
      return c.json({ error: 'Meal plan not found' }, 404);
    }

    const created = db.createSubscription(customerId, mealPlanId);
    return c.json(created, 201);
  } catch {
    return c.json({ error: 'Invalid subscription request' }, 400);
  }
});

api.put('/subscriptions/:id/status', async (c) => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ error: 'Invalid subscription ID' }, 400);

    const body = await c.req.json<{ status?: SubscriptionStatus }>();
    if (!body.status || !['active', 'paused', 'cancelled'].includes(body.status)) {
      return c.json({ error: 'Valid status (active, paused, cancelled) is required' }, 400);
    }

    const updated = db.updateSubscriptionStatus(id, body.status);
    if (!updated) {
      return c.json({ error: 'Subscription not found' }, 404);
    }

    return c.json({ status: updated.status, subscription: updated });
  } catch {
    return c.json({ error: 'Invalid request' }, 400);
  }
});

api.get('/admin/subscriptions', (c) => {
  const subs = db.getAllSubscriptions();
  return c.json(subs);
});

api.get('/admin/stats', (c) => {
  const stats = db.getAdminStats();
  return c.json(stats);
});

app.route('/api', api);
app.route('/', api);

export default app;
