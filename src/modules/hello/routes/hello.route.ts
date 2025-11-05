import { Hono } from 'hono';

const router = new Hono();

router.get('/', c => {
  return c.json({ message: 'hello world' });
});

export default router;
