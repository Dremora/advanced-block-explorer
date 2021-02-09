import JsonRpc from "node-jsonrpc-client";

export const client = new JsonRpc("https://ethdenver-parsiq.net:2096/");

export const callClient = async (
  name: string,
  args: unknown[]
): Promise<unknown> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const result = await client.call(name, args);

  if ("error" in result) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.error(result.error);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    throw new Error(result.error);
  }

  // eslint-disable-next-line
  return result.result;
};

callClient.debug = async (name: string, args: unknown[]): Promise<unknown> => {
  const result = await callClient(name, args);
  console.log(JSON.stringify(result, null, 4));
  return result;
};
