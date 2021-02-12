import { promisify } from "util";

import redis from "redis";

export const useCache = Boolean(process.env.REDIS_URL);

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => {
  console.error(`Redis error ${err}`);
});

const get = useCache
  ? // eslint-disable-next-line @typescript-eslint/unbound-method
    promisify(client.get).bind(client)
  : () => new Promise((resolve, reject) => reject(new Error("Redis disabled")));

export async function cacheGet(keyObject: unknown): Promise<unknown | null> {
  if (useCache) {
    const key = JSON.stringify(keyObject);
    const start = process.hrtime.bigint();
    const cachedValue = await get(key);
    const end = process.hrtime.bigint();
    console.debug(`cache access took ${(end - start) / BigInt(1000000)} ms`);
    if (cachedValue !== null) {
      console.debug("cache hit", key);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(cachedValue as string);
    }
    console.debug("cache miss", key);
    return null;
  } else {
    return null;
  }
}

export const set = useCache
  ? // eslint-disable-next-line @typescript-eslint/unbound-method
    promisify(client.set).bind(client)
  : () => Promise.resolve(null);

export function cacheSet(key: unknown, value: unknown): void {
  if (!useCache) {
    return;
  }
  void set(JSON.stringify(key), JSON.stringify(value));
}
