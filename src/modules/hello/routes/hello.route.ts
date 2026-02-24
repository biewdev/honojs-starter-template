import { Context } from 'hono';
import { createRouter } from 'hono-route-docs';

const { router, get } = createRouter();

get('/', (c: Context) => {
  return c.json({ message: 'hello world' });
});

export default router;
