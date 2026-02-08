import { Hono } from 'hono';
import { showRoutes } from 'hono/dev';
import routes from './modules/routes';

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
