import { BlockTrace } from "@parsiq/block-tracer";
import { GetServerSideProps } from "next";

import { getBlockTrace } from "src/api/api";
import { Anchor } from "src/components/Anchor";
import Heading from "src/components/Heading";
import PageContainer from "src/components/PageContainer";

type Props = {
  blockTrace: BlockTrace | null;
};

export default function Block({ blockTrace }: Props) {
  if (!blockTrace) {
    return <div>Block not found</div>;
  }

  return (
    <PageContainer>
      <Heading>Block {blockTrace.header.blockNumber}</Heading>
      {blockTrace.txs.map((tx) => (
        <div key={tx.txHash}>
          <Anchor
            href={`/blocks/${blockTrace.header.blockNumber}/${tx.txHash}`}
          >
            {tx.txHash}
          </Anchor>
        </div>
      ))}
    </PageContainer>
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
