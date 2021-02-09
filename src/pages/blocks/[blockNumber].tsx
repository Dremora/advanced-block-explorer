import { BlockTrace } from "@parsiq/block-tracer";
import { GetServerSideProps } from "next";
import Link from "next/link";

import { getBlockTrace } from "../../api/getBlockTrace";

type Props = {
  blockTrace: BlockTrace | null;
};

export default function Block({ blockTrace }: Props) {
  if (!blockTrace) {
    return <div>Block not found</div>;
  }

  return (
    <div>
      {blockTrace.txs.map((tx) => (
        <div key={tx.txHash}>
          <Link href={`/blocks/${blockTrace.header.blockNumber}/${tx.txHash}`}>
            {tx.txHash}
          </Link>
        </div>
      ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const blockNumber = String(context.query.blockNumber);
  const blockTrace = await getBlockTrace(blockNumber);

  return {
    props: { blockTrace },
  };
};
