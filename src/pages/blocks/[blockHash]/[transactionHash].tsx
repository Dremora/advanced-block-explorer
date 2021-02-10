import { TransactionTrace } from "@parsiq/block-tracer";
import { GetServerSideProps } from "next";
import { useRouter } from "next/dist/client/router";
import styled from "styled-components";

import { getBlockTrace } from "src/api/api";
import { Anchor } from "src/components/Anchor";
import Heading from "src/components/Heading";
import PageContainer from "src/components/PageContainer";
import { gray } from "src/styles/colors";
import { body } from "src/styles/typography";
import { formatEth, formatHashWithEllipsis, gasPercentage } from "src/utils";

type Props = {
  transactionIndex: number;
  transactionTrace: TransactionTrace | null;
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

export default function Transaction({
  transactionIndex,
  transactionTrace,
}: Props) {
  const router = useRouter();
  const blockHash = String(router.query.blockHash);
  if (!transactionTrace) {
    return <div>Transaction not found</div>;
  }

  return (
    <PageContainer>
      <Sections>
        <Section>
          <Heading>
            Transaction {formatHashWithEllipsis(transactionTrace.txHash)}
          </Heading>

          <KeyValue>
            <Key>Block: </Key>
            <Value>
              <Anchor href={`/blocks/${blockHash}`}>
                <span>{formatHashWithEllipsis(blockHash)}</span>
              </Anchor>
            </Value>
          </KeyValue>

          <KeyValue>
            <Key>Index: </Key>
            <Value>{transactionIndex}</Value>
          </KeyValue>

          <KeyValue>
            <Key>Gas Limit: </Key>
            <Value>{transactionTrace.gasLimit}</Value>
          </KeyValue>

          <KeyValue>
            <Key>Gas Used: </Key>
            <Value>
              {transactionTrace.gasUsed} (
              {gasPercentage(
                parseInt(transactionTrace.gasUsed),
                parseInt(transactionTrace.gasLimit)
              )}
              )
            </Value>
          </KeyValue>

          <KeyValue>
            <Key>Gas Price: </Key>
            <Value>{formatEth(transactionTrace.gasPrice)}</Value>
          </KeyValue>

          <KeyValue>
            <Key>Value: </Key>
            <Value>{formatEth(transactionTrace.item.value)}</Value>
          </KeyValue>
        </Section>
        <Section />
      </Sections>
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const blockHash = String(context.query.blockHash);
  const transactionHash = String(context.query.transactionHash);
  const blockTrace = await getBlockTrace(blockHash);

  const transactionTraceIndex = blockTrace.txs.findIndex(
    (tx) => tx.txHash === transactionHash
  );
  const transactionIndex = transactionTraceIndex + 1;
  const transactionTrace =
    transactionTraceIndex === -1 ? null : blockTrace.txs[transactionTraceIndex];

  return {
    props: { transactionIndex, transactionTrace },
  };
};
