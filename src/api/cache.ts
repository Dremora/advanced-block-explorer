import { promisify } from "util";

import redis from "redis";

export const useCache = Boolean(process.env.REDIS_URL);

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => {
  console.error(`Redis error ${err}`);
});

export const cacheGet = useCache
  ? // eslint-disable-next-line @typescript-eslint/unbound-method
    promisify(client.get).bind(client)
  : () => new Promise((resolve, reject) => reject(new Error("Redis disabled")));

export const cacheSet = useCache
  ? // eslint-disable-next-line @typescript-eslint/unbound-method
    promisify(client.set).bind(client)
  : () => Promise.resolve(null);
