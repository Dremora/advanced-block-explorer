import { BlockTrace } from "@parsiq/block-tracer";

import { callClient } from "./client";

export type BlockHeader = {
  number: number;
  hash: string;
  parentHash: string;
};

export async function getBlocksFrom(
  hash: string,
  count = 10
): Promise<BlockHeader[]> {
  const result = await callClient("eth_blockHeadersFromHash", [hash, count]);

  return result as BlockHeader[];
}

export async function getBlockTrace(blockNumber: string): Promise<BlockTrace> {
  const result = await callClient("debug_transferTrace", [blockNumber]);

  return result as BlockTrace;
}

export async function getLatestBlock(): Promise<number> {
  const result = await callClient("eth_blockNumber", []);

  return parseInt(result as string, 16);
}

type EthBlock = {
  hash: string;
};

export async function getBlockByNumber(blockNumber: number): Promise<EthBlock> {
  const block = await callClient("eth_getBlockByNumber", [
    `0x${blockNumber.toString(16)}`,
    false,
  ]);

  return block as EthBlock;
}
