import { BlockTrace } from "@parsiq/block-tracer";
import { GetServerSideProps } from "next";
import styled from "styled-components";

import { getBlockTrace } from "src/api/api";
import { Anchor } from "src/components/Anchor";
import Heading from "src/components/Heading";
import PageContainer from "src/components/PageContainer";
import { gray } from "src/styles/colors";
import { body } from "src/styles/typography";
import { formatEth, formatHashWithEllipsis, gasPercentage } from "src/utils";

type Props = {
  blockTrace: BlockTrace | null;
};

const Sections = styled.div`
  display: flex;
`;

const Section = styled.div`
  width: 50%;
  flex-shrink: 0;
  flex-grow: 0;
`;

const KeyValue = styled.div`
  display: flex;
  padding: 4px 0;
`;

const Key = styled.div`
  ${body};
  color: ${gray};
  padding-right: 4px;
`;

const Value = styled.div`
  ${body};
  font-weight: 700;
`;

export default function Block({ blockTrace }: Props) {
  if (!blockTrace) {
    return <div>Block not found</div>;
  }

  return (
    <PageContainer>
      <Sections>
        <Section>
          <Heading>Block #{blockTrace.header.blockNumber}</Heading>

          <KeyValue>
            <Key>Hash: </Key>
            <Value>{formatHashWithEllipsis(blockTrace.header.blockHash)}</Value>
          </KeyValue>

          <KeyValue>
            <Key>Parent: </Key>
            <Value>
              <Anchor href={`/blocks/${blockTrace.header.parentBlockHash}`}>
                {formatHashWithEllipsis(blockTrace.header.parentBlockHash)}
              </Anchor>
            </Value>
          </KeyValue>

          <KeyValue>
            <Key>Gas Used: </Key>
            <Value>
              {blockTrace.header.gasUsed} (
              {gasPercentage(
                parseInt(blockTrace.header.gasUsed),
                parseInt(blockTrace.header.gasLimit)
              )}
              )
            </Value>
          </KeyValue>

          <KeyValue>
            <Key>Eth Emission: </Key>
            <Value>??</Value>
          </KeyValue>

          <KeyValue>
            <Key>Eth Fees: </Key>
            <Value>??</Value>
          </KeyValue>

          <KeyValue>
            <Key>Beneficiaries: </Key>
          </KeyValue>

          <KeyValue>
            <Value>
              <ul>
                {blockTrace.rewards.map((reward) => (
                  <li key={reward.beneficiary}>
                    <Value>{reward.beneficiary}</Value>
                    <Value>{formatEth(reward.reward)}</Value>
                  </li>
                ))}
              </ul>
            </Value>
          </KeyValue>
        </Section>
        <Section>
          <Heading>Transactions</Heading>
          {blockTrace.txs.map((tx) => (
            <div key={tx.txHash}>
              <Anchor
                href={`/blocks/${blockTrace.header.blockHash}/${tx.txHash}`}
              >
                {formatHashWithEllipsis(tx.txHash)}
              </Anchor>
            </div>
          ))}
        </Section>
      </Sections>
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const blockHash = String(context.query.blockHash);
  const blockTrace = await getBlockTrace(blockHash);

  return {
    props: { blockTrace },
  };
};
