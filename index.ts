console.log('Initializing...\n');

import { AppServer } from './src/AppServer';

const appServer = AppServer.getInstance();

export default {
  port: 8000,
  fetch: appServer.getApp().fetch,
};
