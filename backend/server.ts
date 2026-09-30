import { serve } from '@hono/node-server';
import app from './src/index';

const port = Number(process.env.PORT) || 8787;
console.log(`Backend server listening on http://0.0.0.0:${port}`);

serve({
  fetch: app.fetch,
  port,
  hostname: '0.0.0.0',
});
