import { TransactionTrace } from "@parsiq/block-tracer";
import { GetServerSideProps } from "next";

import { getBlockTrace } from "../../../api/getBlockTrace";

type Props = {
  transactionTrace: TransactionTrace | null;
};

export default function Transaction({ transactionTrace }: Props) {
  if (!transactionTrace) {
    return <div>Transaction not found</div>;
  }

  return (
    <div>
      <h1>Transaction {transactionTrace.txHash}</h1>
      <div>Origin: {transactionTrace.origin}</div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const blockNumber = String(context.query.blockNumber);
  const transactionHash = String(context.query.transactionHash);
  const blockTrace = await getBlockTrace(blockNumber);

  const transactionTrace =
    blockTrace?.txs.find((tx) => tx.txHash === transactionHash) ?? null;

  return {
    props: { transactionTrace },
  };
};
