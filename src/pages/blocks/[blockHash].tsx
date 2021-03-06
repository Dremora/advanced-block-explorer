import { BlockTrace } from "@parsiq/block-tracer";
import Decimal from "decimal.js";
import { GetServerSideProps } from "next";
import styled from "styled-components";

import {
  getBlockHeader,
  getBlockTrace,
  TransactionInfo,
  transactionsInfoFromBlock,
} from "src/api/api";
import { Anchor } from "src/components/Anchor";
import Heading from "src/components/Heading";
import PageContainer from "src/components/PageContainer";
import { TransactionsList } from "src/components/TransactionsList";
import { gray } from "src/styles/colors";
import { body } from "src/styles/typography";
import {
  formatEth,
  formatGas,
  formatHashWithEllipsis,
  gasPercentage,
} from "src/utils";

type Props = {
  blockHeader: BlockTrace["header"] | null;
  rewards: BlockTrace["rewards"];
  transactions: TransactionInfo[];
  ethFees: string;
  ethEmission: string;
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

export default function Block({
  blockHeader,
  rewards,
  transactions,
  ethFees,
  ethEmission,
}: Props) {
  if (!blockHeader) {
    return <div>Block not found</div>;
  }

  return (
    <PageContainer>
      <Sections>
        <Section>
          <Heading>Block #{blockHeader.blockNumber}</Heading>

          <KeyValue>
            <Key>Hash: </Key>
            <Value>{formatHashWithEllipsis(blockHeader.blockHash)}</Value>
          </KeyValue>

          <KeyValue>
            <Key>Parent: </Key>
            <Value>
              <Anchor href={`/blocks/${blockHeader.parentBlockHash}`}>
                {formatHashWithEllipsis(blockHeader.parentBlockHash)}
              </Anchor>
            </Value>
          </KeyValue>

          <KeyValue>
            <Key>Gas Used: </Key>
            <Value>
              {formatGas(blockHeader.gasUsed)} (
              {gasPercentage(
                parseInt(blockHeader.gasUsed),
                parseInt(blockHeader.gasLimit)
              )}
              )
            </Value>
          </KeyValue>

          <KeyValue>
            <Key>Eth Emission: </Key>
            <Value>{formatEth(ethEmission)}</Value>
          </KeyValue>

          <KeyValue>
            <Key>Eth Fees: </Key>
            <Value>{formatEth(ethFees)}</Value>
          </KeyValue>

          <KeyValue>
            <Key>Beneficiaries: </Key>
          </KeyValue>

          <KeyValue>
            <Value>
              <ul>
                {rewards.map((reward) => (
                  <li key={reward.beneficiary}>
                    <Value>{reward.beneficiary}</Value>
                    <Value>{formatEth(reward.reward, "eth")}</Value>
                  </li>
                ))}
              </ul>
            </Value>
          </KeyValue>
        </Section>
        <Section>
          <Heading>Transactions</Heading>

          <TransactionsList
            includeIndex
            transactionsBlockHash={blockHeader.blockHash}
            transactions={transactions}
          />
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

  const blockHeader = await getBlockHeader({
    number: blockTrace.header.blockNumber,
    hash: blockHash,
    parentHash: blockTrace.header.parentBlockHash,
  });

  const ethFees = blockHeader.gasCost;

  const ethEmission = blockTrace.rewards
    .reduce(
      (acc, current) => new Decimal(current.reward).add(acc),
      new Decimal("0")
    )
    .minus(new Decimal(ethFees))
    .toString();

  console.log({ ethEmission });

  return {
    props: {
      blockHeader: blockTrace.header,
      rewards: blockTrace.rewards,
      transactions: transactionsInfoFromBlock(blockTrace),
      ethFees,
      ethEmission,
    },
  };
};
