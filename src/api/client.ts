import JsonRpc from "node-jsonrpc-client";

import { cacheGet, cacheSet, useCache } from "./cache";

export const client = new JsonRpc("https://ethdenver-parsiq.net:2096/");

type Options = {
  cache?: boolean;
};

export const callClient = async (
  name: string,
  args: unknown[],
  options: Options = {}
): Promise<unknown> => {
  const { cache = true } = options;

  console.log(useCache, process.env.REDIS_URL);

  const key = { name, args };

  if (useCache && cache) {
    const cachedValue = await cacheGet(key);
    if (cachedValue !== null) {
      return cachedValue;
    }
    console.debug("cache miss", key);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = await client.call(name, args);

  if ("error" in data) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.error(data.error);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    throw new Error(data.error);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { result } = data;

  if (useCache && cache) {
    cacheSet(key, result);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return result;
};

callClient.debug = async (name: string, args: unknown[]): Promise<unknown> => {
  const result = await callClient(name, args);
  console.log(JSON.stringify(result, null, 4));
  return result;
};
