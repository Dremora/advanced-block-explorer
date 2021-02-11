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
}

export function TransactionTree({ transactionItem }: TransactionTreeProps) {
  console.log("transactionItem", transactionItem);
  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      <p>test</p>
      <TransactionItem transactionItem={transactionItem} />
    </TreeView>
  );
}

interface Props {
  transactionItem: Item;
}

function TransactionItem({ transactionItem }: Props) {
  const nodeId = `${transactionItem.to}/${transactionItem.from}/${transactionItem.value}`;

  return (
    <TreeItem nodeId={nodeId} label={transactionItem.from}>
      {transactionItem.items.map((item) => (
        <TransactionItem
          key={`${item.from}/${item.to}/${item.value}`}
          transactionItem={item}
        />
      ))}
    </TreeItem>
  );
}
