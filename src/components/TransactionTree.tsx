import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";
import { Message } from "@parsiq/block-tracer";
import styled from "styled-components";

import { Operation } from "src/components/Operation";
import { formatHashWithEllipsis } from "src/utils";

const StyledTreeItem = styled(TreeItem)`
  &.MuiTreeItem-root {
    padding-top: 2px;
    padding-bottom: 2px;
  }
`;

export declare type GasRange = readonly [number, number];

type ItemMessage = Omit<Message<never>, "parent"> & {
  gasRange: GasRange;
  value: string;
};
interface Item {
  message: ItemMessage;
  children: Item[];
}

export interface TransactionTreeProps {
  transactionItems: Item[];
  onSelectItem: (item: Item) => void;
}

export function TransactionTree({
  transactionItems,
  onSelectItem,
}: TransactionTreeProps) {
  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {transactionItems.map((item, i) => {
        const key = `${JSON.stringify(item.message)}-tree-view-${i}`;
        return (
          <TransactionItem
            key={key}
            transactionItem={item}
            onSelectItem={onSelectItem}
          />
        );
      })}
    </TreeView>
  );
}

interface TransactionItemProps {
  transactionItem: Item;
  onSelectItem: (item: Item) => void;
}

function TransactionItem({
  transactionItem,
  onSelectItem,
}: TransactionItemProps) {
  const nodeId = `${JSON.stringify(transactionItem.message)}-nodeId`;

  return (
    <StyledTreeItem
      nodeId={nodeId}
      label={
        <>
          <Operation operation={transactionItem.message.op} />{" "}
          {formatHashWithEllipsis(transactionItem.message.contract)}
        </>
      }
      onClick={() => onSelectItem(transactionItem)}
    >
      {transactionItem.children.map((item, index) => {
        const key = `${JSON.stringify(
          transactionItem.message
        )}-transactionItem-${index}`;
        return (
          <TransactionItem
            key={key}
            transactionItem={item}
            onSelectItem={onSelectItem}
          />
        );
      })}
    </StyledTreeItem>
  );
}
