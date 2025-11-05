import { Hono } from 'hono';
import helloRoute from './hello/routes/hello.route';

const router = new Hono();

router.route('/hello', helloRoute);

export default router;
