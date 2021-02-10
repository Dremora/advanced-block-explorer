import { BlockTrace } from "@parsiq/block-tracer";
import { GetServerSideProps } from "next";
import styled from "styled-components";
import useSWR from "swr";

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
import { Table, Tbody, Td, Th, Thead, Tr } from "src/components/Table";
import { formatHashWithEllipsis } from "src/utils";
import { fetcher } from "src/utils/fetcher";

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
  padding: 0 10px;
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
  blocks: initialBlocks,
  transactions,
  transactionsBlockHash,
}: Props) {
  const { data: blocks = [] } = useSWR<BlockHeader[]>(
    "/api/latest-blocks",
    fetcher,
    { refreshInterval: 14000, initialData: initialBlocks }
  );

  return (
    <PageContainer>
      <Sections>
        <Section>
          <Heading>Recent Blocks</Heading>

          <Table>
            <Thead>
              <Tr>
                <Th align="right">Number</Th>
                <Th>Hash</Th>
                <Th>Gas Price</Th>
              </Tr>
            </Thead>
            <Tbody>
              {blocks.map((block) => (
                <Tr key={block.number} title={block.hash}>
                  <Td align="right">{block.number}</Td>
                  <Td>
                    <Anchor href={`/blocks/${block.hash}`}>
                      <span>{formatHashWithEllipsis(block.hash)}</span>
                    </Anchor>
                  </Td>
                  <Td>{block.gasPrice} </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
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
