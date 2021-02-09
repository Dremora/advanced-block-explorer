import { BlockTrace } from "@parsiq/block-tracer";
import JsonRpc from "node-jsonrpc-client";

const rpcClient = new JsonRpc("https://ethdenver-parsiq.net:2096/");

export async function getBlockTrace(
  blockNumber: string
): Promise<BlockTrace | null> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const result = await rpcClient.call("debug_transferTrace", [blockNumber]);
  if ("error" in result) {
    return null;
  }
  // eslint-disable-next-line
  return result.result as BlockTrace;
}
