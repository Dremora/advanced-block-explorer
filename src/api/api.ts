import { BlockTrace, Message } from "@parsiq/block-tracer";
import { Decimal } from "decimal.js";

import { callClient } from "./client";

type OriginalBlockHeader = {
  number: number;
  hash: string;
  parentHash: string;
};

export async function getBlocksFrom(
  hash: string,
  count = 10
): Promise<OriginalBlockHeader[]> {
  const result = await callClient("eth_blockHeadersFromHash", [hash, count]);

  return result as OriginalBlockHeader[];
}

export async function getBlockTrace(blockHash: string): Promise<BlockTrace> {
  const result = await callClient("debug_transferTrace", [blockHash]);

  return result as BlockTrace;
}

export async function injectCallBulk(
  blockHash: string,
  txIndex: number,
  gasTimeStamp: number,
  code: string,
  credit: number
): Promise<unknown> {
  const txArr = [
    {
      txIndex,
      levels: [
        {
          gasTimeStamp,
          code,
          credit,
        },
      ],
    },
  ];
  const result = await callClient("debug_injectCallBulk", [
    blockHash,
    JSON.stringify(txArr),
  ]);

  return result;
}

export async function getLatestBlock(): Promise<number> {
  const result = await callClient("eth_blockNumber", [], {
    cache: false,
  });

  return parseInt(result as string, 16);
}

export type BlockHeader = {
  number: number;
  hash: string;
  gasPrice: string;
  gasCost: string;
  parentHash: string;
};

const gasCostFromTrace = (trace: BlockTrace) =>
  trace.txs
    .map((tx) => new Decimal(tx.gasUsed).mul(new Decimal(tx.gasPrice)))
    .reduce((acc, current) => acc.add(current), new Decimal(0))
    .toString();

const gasUsedFromTrace = (trace: BlockTrace) =>
  trace.txs
    .map((tx) => new Decimal(tx.gasUsed))
    .reduce((acc, current) => acc.add(current), new Decimal(0))
    .toString();

export async function getLatestBlocks(): Promise<BlockHeader[]> {
  const blockNumber = await getLatestBlock();
  const latestBlock = await getBlockByNumber(blockNumber);
  const blocks = await getBlocksFrom(latestBlock.hash);
  return Promise.all(
    blocks.map((block) =>
      getBlockTrace(block.hash).then((trace) => {
        const gasCost = gasCostFromTrace(trace);
        const gasUsed = gasUsedFromTrace(trace);

        const gasPrice = new Decimal(gasCost)
          .div(new Decimal(gasUsed))
          .round()
          .toString();

        return {
          ...block,
          gasCost,
          gasPrice,
        };
      })
    )
  );
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
  operation: Message<never>["op"] | "DEPLOYMENT" | "TRANSFER";
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
          ? ("TRANSFER" as const)
          : tx.item.address === "0x"
          ? ("DEPLOYMENT" as const)
          : tx.item.op,
      success: tx.item.result?.success ?? false,
    }))
    .reverse();
}
