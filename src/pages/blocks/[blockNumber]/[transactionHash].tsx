import { TransactionTrace } from "@parsiq/block-tracer";
import { GetServerSideProps } from "next";

import { getBlockTrace } from "src/api/api";
import Heading from "src/components/Heading";
import PageContainer from "src/components/PageContainer";
import { formatHashWithEllipsis } from "src/utils";

type Props = {
  transactionTrace: TransactionTrace | null;
};

export default function Transaction({ transactionTrace }: Props) {
  if (!transactionTrace) {
    return <div>Transaction not found</div>;
  }

  return (
    <PageContainer>
      <Heading>
        Transaction {formatHashWithEllipsis(transactionTrace.txHash)}
      </Heading>
      <div>Origin: {transactionTrace.origin}</div>
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const blockNumber = String(context.query.blockNumber);
  const transactionHash = String(context.query.transactionHash);
  const blockTrace = await getBlockTrace(blockNumber);

  const transactionTrace =
    blockTrace.txs.find((tx) => tx.txHash === transactionHash) ?? null;

  return {
    props: { transactionTrace },
  };
};
