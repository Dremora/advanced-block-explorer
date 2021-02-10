import { BlockTrace, traceTx } from "@parsiq/block-tracer";
import { GetServerSideProps } from "next";
import styled from "styled-components";

import {
  BlockHeader,
  getBlockByNumber,
  getBlocksFrom,
  getBlockTrace,
  getLatestBlock,
} from "src/api/api";
import { Anchor } from "src/components/Anchor";
import Heading from "src/components/Heading";
import { Operation } from "src/components/Operation";
import PageContainer from "src/components/PageContainer";
import { formatHashWithEllipsis } from "src/utils";

type Transaction = {
  hash: string;
  operation: string;
};

type Props = {
  blocks: BlockHeader[];
  transactions: Transaction[];
  transactionsBlockHash: string;
};

const Sections = styled.div`
  display: flex;
`;

const Section = styled.div`
  width: 50%;
  flex-shrink: 0;
  flex-grow: 0;
`;

const TransactionContainer = styled.div`
  display: flex;
  margin: 3px 0;
  align-items: baseline;
`;

export default function Home({
  blocks,
  transactions,
  transactionsBlockHash,
}: Props) {
  return (
    <PageContainer>
      <Sections>
        <Section>
          <Heading>Recent Blocks</Heading>

          {blocks.map((block) => (
            <div key={block.number} title={block.hash}>
              <Anchor href={`/blocks/${block.hash}`}>
                <span>{block.number}</span>
              </Anchor>
            </div>
          ))}
        </Section>

        <Section>
          <Heading>Recent Transactions</Heading>

          {transactions.map((transaction) => (
            <TransactionContainer
              key={transaction.hash}
              title={transaction.hash}
            >
              <Anchor
                href={`/blocks/${transactionsBlockHash}/${transaction.hash}`}
              >
                <span>{formatHashWithEllipsis(transaction.hash)}</span>
              </Anchor>
              <Operation operation={transaction.operation} />
            </TransactionContainer>
          ))}
        </Section>
      </Sections>
    </PageContainer>
  );
}

function transactionsFromBlock(block: BlockTrace): Transaction[] {
  return block.txs.slice(0, 20).map((tx) => ({
    hash: tx.txHash,
    operation: tx.item.op,
    // status: traceTx(tx)[0].tx.
  }));
}

export const getServerSideProps: GetServerSideProps<Props> = async function () {
  const blockNumber = await getLatestBlock();
  const latestBlock = await getBlockByNumber(blockNumber);

  return {
    props: {
      blocks: await getBlocksFrom(latestBlock.hash),
      transactionsBlockHash: latestBlock.hash,
      transactions: await getBlockTrace(latestBlock.hash).then(
        transactionsFromBlock
      ),
    },
  };
};
