import { Hono } from 'hono';
import { showRoutes } from 'hono/dev';
import routes from './modules/routes';
import { openAPIDoc } from 'hono-route-docs';
import { Scalar } from '@scalar/hono-api-reference';

export class AppServer {
  private static instance: AppServer | null = null;
  private app: Hono;
  private isShuttingDown: boolean = false;

  private constructor() {
    this.app = new Hono();
    this.load();
    this.setupShutdownHandlers();
  }

  public static getInstance(): AppServer {
    if (!AppServer.instance) {
      AppServer.instance = new AppServer();
    }
    return AppServer.instance;
  }

  public static resetInstance(): void {
    if (AppServer.instance) {
      AppServer.instance.cleanup();
      AppServer.instance = null;
    }
  }

  private load() {
    this.app.route('/api/', routes);

    this.app.get(
      '/openapi.json',
      openAPIDoc(routes, {
        title: 'Template API',
        version: '0.1.0',
        description: 'Template Backend API Documentation',
        prefix: '/api',
      }),
    );

    this.app.get(
      '/docs',
      Scalar({
        url: '/openapi.json',
        theme: 'kepler',
        layout: 'classic',
        showDeveloperTools: 'localhost',
        persistAuth: true,
        operationTitleSource: 'summary',
      }),
    );

    showRoutes(this.app);
  }

  private setupShutdownHandlers() {
    const shutdown = async (signal: string) => {
      if (this.isShuttingDown) return;

      this.isShuttingDown = true;
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      await this.cleanup();

      console.log('Shutdown complete.');
      process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }

  private async cleanup(): Promise<void> {
    try {
      console.log('Cleaning up resources...');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  public getApp() {
    return this.app;
  }
}

export default AppServer;
