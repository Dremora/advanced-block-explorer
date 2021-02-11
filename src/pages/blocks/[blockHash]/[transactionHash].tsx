import { trace } from "console";

import {
  Message,
  traceBlock,
  traceTx,
  TransactionTrace,
} from "@parsiq/block-tracer";
import { GetServerSideProps } from "next";
import { useRouter } from "next/dist/client/router";
import styled from "styled-components";

import { getBlockTrace } from "src/api/api";
import { Anchor } from "src/components/Anchor";
import Heading from "src/components/Heading";
import PageContainer from "src/components/PageContainer";
import {
  TransactionTree,
  TransactionTreeProps,
} from "src/components/TransactionTree";
import { gray } from "src/styles/colors";
import { body } from "src/styles/typography";
import { formatEth, formatHashWithEllipsis, gasPercentage } from "src/utils";

export declare type GasRange = readonly [number, number];

type NewMessage = Omit<Message<never>, "parent"> & {
  gasRange: GasRange;
  value: string;
};

type Node = {
  message: NewMessage;
  children: Node[];
};

type Props = {
  roots: Node[];
  transactionIndex: number;
  transactionTrace: TransactionTrace | null;
  transactionItem?: TransactionTreeProps["transactionItem"];
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

export default function Transaction({
  transactionIndex,
  roots,
  transactionTrace,
}: // transactionItem, TODO:
Props) {
  const router = useRouter();
  const blockHash = String(router.query.blockHash);
  if (!transactionTrace) {
    return <div>Transaction not found</div>;
  }

  const transactionItem: TransactionTreeProps["transactionItem"] = {
    from: "0x7065",
    to: "0xefe3",
    value: "3985549674596854",
    items: [
      {
        from: "0x7066",
        to: "0xefe3",
        value: "3985549674596854",
        items: [
          {
            from: "0x7067",
            to: "0xefe3",
            value: "3985549674596854",
            items: [],
          },
          {
            from: "0x7099",
            to: "0xefe3",
            value: "3985549674596854",
            items: [],
          },
        ],
      },
      {
        from: "0x7068",
        to: "0xefe3",
        value: "3985549674596854",
        items: [],
      },
    ],
  };
  return (
    <PageContainer>
      <pre>{JSON.stringify(roots, null, 2)}</pre>
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
        <Section>
          {transactionItem && (
            <TransactionTree transactionItem={transactionItem} />
          )}
        </Section>
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

  const map = new Map<Message<never>, Node>();
  const roots: Node[] = [];
  for (const transaction of traceBlock(blockTrace)) {
    for (const { msg } of traceTx(transaction)) {
      const {
        parent,
        gasRange,
        value,
        data,
        ...messageWithoutParent
      } = msg as Message<never> & {
        gasRange: GasRange | undefined;
        value: string | undefined;
      };
      const item: Node = {
        message: {
          ...messageWithoutParent,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          gasRange: gasRange ?? (parent.gasRange as GasRange),
          value: value ?? "0",
          data: data ?? "",
        },
        children: [],
      };
      map.set(msg, item);
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (msg.parent.level === 0) {
        roots.push(item);
      } else {
        const parent = map.get(msg.parent);
        parent?.children.push(item);
      }
    }
  }

  console.log(roots);

  const transactionTraceIndex = blockTrace.txs.findIndex(
    (tx) => tx.txHash === transactionHash
  );
  const transactionIndex = transactionTraceIndex + 1;
  const transactionTrace =
    transactionTraceIndex === -1 ? null : blockTrace.txs[transactionTraceIndex];

  return {
    props: { transactionIndex, transactionTrace, roots },
  };
};
