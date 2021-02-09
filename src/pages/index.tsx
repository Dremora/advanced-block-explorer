import { GetServerSideProps } from "next";

import {
  BlockHeader,
  getBlockByNumber,
  getBlocksFrom,
  getLatestBlock,
} from "src/api/api";
import { Anchor } from "src/components/Anchor";
import PageContainer from "src/components/PageContainer";
import PageHeader from "src/components/PageHeader";

type Props = {
  blocks: BlockHeader[];
};

export default function Home({ blocks }: Props) {
  return (
    <PageContainer>
      <PageHeader>Latest blocks</PageHeader>

      {blocks.map((block) => (
        <div key={block.number} title={block.hash}>
          <Anchor href={`/blocks/${block.hash}`}>
            <span>{block.number}</span>
          </Anchor>
        </div>
      ))}
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async function () {
  const blockNumber = await getLatestBlock();
  const latestBlock = await getBlockByNumber(blockNumber);
  const blocks = await getBlocksFrom(latestBlock.hash);

  return {
    props: {
      blocks,
    },
  };
};
