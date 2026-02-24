import { createRouter } from 'hono-route-docs';
import helloRoute from './hello/routes/hello.route';

const { router, route } = createRouter();

route('/hello', helloRoute, { tags: ['Hello'] });

export default router;
