# Electra Smart JS client

Port of [`yonatanp/electrasmart`](https://github.com/yonatanp/electrasmart) in JS

## Usage

**Get the authentication data**

```bash
npm i -g electra-smart-js-client

electra-smart-js-client
# This will log { "imei": "<imei>", "token": "<token>" }
# Save it for later use
```

**Use it from Node.js code**
```js
import { Client } from 'electra-smart-js-client';

async function run() {
  const client = await new Client({
    imei: '<imei>', // This is the imei value from the previous step
    token: '<token>', // This is the token value from the previous step
  });

  const devices = await client.getDevices();

  // Choose the device you want to control
  const deviceId = devices[0].id;

  // Control it 🔥
  await client.setMode(deviceId, 'HEAT');
}

run().then(console.log).catch(console.error);

```
