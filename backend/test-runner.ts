import app from './src/index';

// Automated test suite for backend API routes
async function runTests() {
  console.log('--- Starting Route Tests ---');
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<boolean>) {
    try {
      const ok = await fn();
      if (ok) {
        console.log(`✅ [PASS] ${name}`);
        passed++;
      } else {
        console.error(`❌ [FAIL] ${name}`);
        failed++;
      }
    } catch (e) {
      console.error(`❌ [ERROR] ${name}:`, e);
      failed++;
    }
  }

  await test('GET /api/health', async () => {
    const res = await app.request('/api/health');
    const data = await res.json();
    return res.status === 200 && data.status === 'healthy';
  });

  let customerToken = '';
  await test('POST /api/auth/login (Customer: customer@gmail.com)', async () => {
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer@gmail.com', password: 'customer123' }),
    });
    const data = await res.json();
    customerToken = data.token;
    return res.status === 200 && data.user.email === 'customer@gmail.com' && data.user.role === 'customer' && !!data.token;
  });

  let adminToken = '';
  await test('POST /api/auth/login (Admin: admin@gmail.com)', async () => {
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin123' }),
    });
    const data = await res.json();
    adminToken = data.token;
    return res.status === 200 && data.user.email === 'admin@gmail.com' && data.user.role === 'admin' && !!data.token;
  });

  await test('POST /api/auth/login (Invalid credentials rejection)', async () => {
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@gmail.com', password: 'wrongpassword' }),
    });
    return res.status === 401;
  });

  await test('POST /api/auth/register', async () => {
    const res = await app.request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Alice Test', email: 'alice@test.com', password: 'secretpassword', role: 'customer' }),
    });
    const data = await res.json();
    return res.status === 201 && data.user.name === 'Alice Test' && !!data.token;
  });

  let planId = 0;
  await test('GET /api/meal-plans', async () => {
    const res = await app.request('/api/meal-plans');
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      planId = data[0].id;
      return true;
    }
    return false;
  });

  let createdPlanId = 0;
  await test('POST /api/meal-plans', async () => {
    const res = await app.request('/api/meal-plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        name: 'Test Gourmet Plan',
        description: 'Special organic chef meals',
        price: 2499,
        status: 'active',
        meal_type: 'dinner',
      }),
    });
    const data = await res.json();
    createdPlanId = data.id;
    return res.status === 201 && data.name === 'Test Gourmet Plan' && data.price === 2499;
  });

  await test('PUT /api/meal-plans/:id', async () => {
    const res = await app.request(`/api/meal-plans/${createdPlanId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        name: 'Test Gourmet Plan Updated',
        description: 'Updated chef meals',
        price: 2599,
        status: 'active',
        meal_type: 'lunch',
      }),
    });
    const data = await res.json();
    return res.status === 200 && data.name === 'Test Gourmet Plan Updated' && data.price === 2599;
  });

  await test('DELETE /api/meal-plans/:id', async () => {
    const res = await app.request(`/api/meal-plans/${createdPlanId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    return res.status === 204;
  });

  await test('GET /api/subscriptions', async () => {
    const res = await app.request('/api/subscriptions', {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    const data = await res.json();
    return res.status === 200 && Array.isArray(data) && data.length > 0 && !!data[0].meal_plan;
  });

  let newSubId = 0;
  await test('POST /api/subscriptions', async () => {
    const res = await app.request('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({ meal_plan_id: planId }),
    });
    const data = await res.json();
    newSubId = data.id;
    return res.status === 201 && data.meal_plan_id === planId && !!data.meal_plan;
  });

  await test('PUT /api/subscriptions/:id/status', async () => {
    const res = await app.request(`/api/subscriptions/${newSubId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({ status: 'paused' }),
    });
    const data = await res.json();
    return res.status === 200 && data.status === 'paused';
  });

  await test('GET /api/admin/subscriptions', async () => {
    const res = await app.request('/api/admin/subscriptions', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    return res.status === 200 && Array.isArray(data) && data.length > 0;
  });

  await test('GET /api/admin/stats', async () => {
    const res = await app.request('/api/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    return (
      res.status === 200 &&
      typeof data.total_customers === 'number' &&
      typeof data.active_subscriptions === 'number' &&
      typeof data.total_meal_plans === 'number'
    );
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

runTests();
