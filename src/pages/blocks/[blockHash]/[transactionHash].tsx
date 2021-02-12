import { Box, Divider, Paper, Tab, Tabs } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { ArrowRight } from "@material-ui/icons";
import {
  Message,
  traceBlock,
  traceTx,
  TransactionTrace,
} from "@parsiq/block-tracer";
import { GetServerSideProps } from "next";
import { useRouter } from "next/dist/client/router";
import React from "react";
import styled from "styled-components";

import { getBlockTrace } from "src/api/api";
import { Anchor } from "src/components/Anchor";
import Heading, { Heading2 } from "src/components/Heading";
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
  transactionItems: TransactionTreeProps["transactionItems"];
  transactionIndex: number;
  transactionTrace: TransactionTrace | null;
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Transaction({
  transactionIndex,
  transactionItems,
  transactionTrace,
}: Props) {
  const router = useRouter();
  const blockHash = String(router.query.blockHash);

  const [selectedTransactionItem, setSelectedTransactionItem] = React.useState(
    transactionItems[0]
  );

  const onSelectItem = React.useCallback(
    (item: TransactionTreeProps["transactionItems"][0]) => {
      setSelectedTransactionItem(item);
    },
    []
  );

  const [value, setValue] = React.useState(0);

  const handleChange = (
    event: React.ChangeEvent<Record<string, unknown>>,
    newValue: number
  ) => {
    setValue(newValue);
  };

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

          <Box paddingY={2} />
          <Divider />
          <Box paddingY={2} />

          <TransactionTree
            transactionItems={transactionItems}
            onSelectItem={onSelectItem}
          />
        </Section>
        <Section>
          <Heading2>
            {formatHashWithEllipsis(selectedTransactionItem.message.sender)}
            <ArrowRight />{" "}
            {formatHashWithEllipsis(selectedTransactionItem.message.contract)}
          </Heading2>
          <Paper>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Decoded" />
              <Tab label="Binary" />
              <Tab label="Eval" />
            </Tabs>
          </Paper>
          <TabPanel value={value} index={0}>
            Not implemented yet
          </TabPanel>
          <TabPanel value={value} index={1}>
            Item Two
          </TabPanel>
          <TabPanel value={value} index={2}>
            Item Three
          </TabPanel>
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

  const transactionTraceIndex = blockTrace.txs.findIndex(
    (tx) => tx.txHash === transactionHash
  );
  const transactionIndex = transactionTraceIndex + 1;
  const transactionTrace =
    transactionTraceIndex === -1 ? null : blockTrace.txs[transactionTraceIndex];

  return {
    props: { transactionIndex, transactionTrace, transactionItems: roots },
  };
};
