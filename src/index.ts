#!/usr/bin/env node

import { Client } from './electra/client';

if (require.main === module) {
  // This means that we are running this script directly from the command line
  // https://nodejs.org/docs/latest/api/modules.html#accessing-the-main-module
  Client.auth().then((client) => {
    console.log(client.getAuthData());
  });
}

// Exporting this so it can be used as a module
export { Client };
