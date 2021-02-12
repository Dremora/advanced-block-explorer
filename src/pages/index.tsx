import { GetServerSideProps } from "next";
import styled from "styled-components";
import useSWR from "swr";

import {
  BlockHeader,
  getBlockByNumber,
  getBlockTrace,
  getLatestBlock,
  getLatestBlocks,
  TransactionInfo,
  transactionsInfoFromBlock,
} from "src/api/api";
import { Anchor } from "src/components/Anchor";
import Heading from "src/components/Heading";
import PageContainer from "src/components/PageContainer";
import { Table, Tbody, Td, Th, Thead, Tr } from "src/components/Table";
import { TransactionsList } from "src/components/TransactionsList";
import { formatEth, formatHashWithEllipsis } from "src/utils";
import { fetcher } from "src/utils/fetcher";

type Props = {
  blocks: BlockHeader[];
  transactions: TransactionInfo[];
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
                  <Td>{formatEth(block.gasPrice, "gwei")} </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Section>

        <Section>
          <Heading>Recent Transactions</Heading>

          <TransactionsList
            transactions={transactions}
            transactionsBlockHash={transactionsBlockHash}
          />
        </Section>
      </Sections>
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async function () {
  const blockNumber = await getLatestBlock();
  const latestBlock = await getBlockByNumber(blockNumber);

  return {
    props: {
      blocks: await getLatestBlocks(),
      transactionsBlockHash: latestBlock.hash,
      transactions: await getBlockTrace(latestBlock.hash)
        .then(transactionsInfoFromBlock)
        .then((txs) => txs.slice(0, 50)),
    },
  };
};
