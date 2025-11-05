import { Hono } from 'hono';
import { showRoutes } from 'hono/dev';
import routes from './modules/routes';

export class AppServer {
  private app: Hono;

  constructor() {
    this.app = new Hono();
    this.load();
  }

  private load() {
    this.app.route('/api/', routes);

    showRoutes(this.app);
  }

  public getApp() {
    return this.app;
  }
}

export default AppServer;
