import { promisify } from "util";

import redis from "redis";

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => {
  console.error(`Redis error ${err}`);
});

// eslint-disable-next-line @typescript-eslint/unbound-method
export const cacheGet = promisify(client.get).bind(client);

// eslint-disable-next-line @typescript-eslint/unbound-method
export const cacheSet = promisify(client.set).bind(client);
