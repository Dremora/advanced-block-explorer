import { TransactionInfo } from "src/api/api";
import { formatHashWithEllipsis } from "src/utils";

import { Anchor } from "./Anchor";
import { Operation } from "./Operation";
import { Table, Tbody, Td, Th, Thead, Tr } from "./Table";

type Props = {
  includeIndex?: boolean;
  transactions: TransactionInfo[];
  transactionsBlockHash: string;
};

export const TransactionsList = ({
  includeIndex = false,
  transactions,
  transactionsBlockHash,
}: Props) => {
  return (
    <Table>
      <Thead>
        <Tr>
          {includeIndex && <Th align="right">#</Th>}
          <Th />
          <Th>Hash</Th>
          <Th>Op</Th>
        </Tr>
      </Thead>
      <Tbody>
        {transactions.map((transaction) => (
          <Tr key={transaction.txHash}>
            {includeIndex && <Td align="right">{transaction.index}</Td>}
            <Td>{transaction.success ? "✅" : "❌"}</Td>
            <Td>
              <Anchor
                title={transaction.txHash}
                href={`/blocks/${transactionsBlockHash}/${transaction.txHash}`}
              >
                <span>{formatHashWithEllipsis(transaction.txHash)}</span>
              </Anchor>
            </Td>
            <Td>
              <Operation operation={transaction.operation} />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
