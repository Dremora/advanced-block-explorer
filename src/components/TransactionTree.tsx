import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";

interface Item {
  from: string;
  to: string;
  value: string;
  items: Item[];
}

export interface TransactionTreeProps {
  transactionItem: Item;
  onSelectItem: (item: TransactionTreeProps["transactionItem"]) => void;
}

export function TransactionTree({
  transactionItem,
  onSelectItem,
}: TransactionTreeProps) {
  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      <p>test</p>
      <TransactionItem
        transactionItem={transactionItem}
        onSelectItem={onSelectItem}
      />
    </TreeView>
  );
}

interface Props {
  transactionItem: Item;
  onSelectItem: (item: TransactionTreeProps["transactionItem"]) => void;
}

function TransactionItem({ transactionItem, onSelectItem }: Props) {
  const nodeId = `${transactionItem.to}/${transactionItem.from}/${transactionItem.value}`;

  return (
    <TreeItem
      nodeId={nodeId}
      label={transactionItem.from}
      onClick={() => onSelectItem(transactionItem)}
    >
      {transactionItem.items.map((item) => (
        <TransactionItem
          key={`${item.from}/${item.to}/${item.value}`}
          transactionItem={item}
          onSelectItem={onSelectItem}
        />
      ))}
    </TreeItem>
  );
}
