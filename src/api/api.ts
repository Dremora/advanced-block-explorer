import { BlockTrace } from "@parsiq/block-tracer";

import { callClient } from "./client";

export type BlockHeader = {
  number: number;
  hash: string;
  gasPrice: string;
  parentHash: string;
};

export async function getBlocksFrom(
  hash: string,
  count = 10
): Promise<BlockHeader[]> {
  const result = await callClient("eth_blockHeadersFromHash", [hash, count]);

  return result as BlockHeader[];
}

export async function getBlockTrace(blockHash: string): Promise<BlockTrace> {
  const result = await callClient("debug_transferTrace", [blockHash]);

  return result as BlockTrace;
}

export async function getLatestBlock(): Promise<number> {
  const result = await callClient("eth_blockNumber", [], {
    cache: false,
  });

  return parseInt(result as string, 16);
}

export async function getLatestBlocks(): Promise<BlockHeader[]> {
  const blockNumber = await getLatestBlock();
  const latestBlock = await getBlockByNumber(blockNumber);
  return getBlocksFrom(latestBlock.hash);
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

export type TransactionInfo = {
  txHash: string;
  operation: string;
  index: number;
  success: boolean;
  gasUsed: string;
};

export function transactionsInfoFromBlock(
  block: BlockTrace
): TransactionInfo[] {
  return block.txs
    .map((tx, index) => ({
      index: index + 1,
      txHash: tx.txHash,
      gasUsed: tx.gasUsed,
      operation:
        tx.item.data === "0x" && !tx.item.items
          ? "TRANSFER"
          : tx.item.address === "0x"
          ? "DEPLOYMENT"
          : tx.item.op,
      success: tx.item.result?.success ?? false,
    }))
    .reverse();
}
