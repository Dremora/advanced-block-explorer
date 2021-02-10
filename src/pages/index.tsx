import { GetServerSideProps } from "next";

import {
  BlockHeader,
  getBlockByNumber,
  getBlocksFrom,
  getLatestBlock,
} from "src/api/api";
import { Anchor } from "src/components/Anchor";
import Heading from "src/components/Heading";
import PageContainer from "src/components/PageContainer";

type Props = {
  blocks: BlockHeader[];
};

export default function Home({ blocks }: Props) {
  return (
    <PageContainer>
      <Heading>Recent Blocks</Heading>

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
