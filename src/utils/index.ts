import Decimal from "decimal.js";

export function formatHashWithEllipsis(text: string, show = 20) {
  if (text.length < show) {
    return text;
  }

  return `${text.substr(0, Math.ceil((show - 3) / 2))}…${text.substr(
    -Math.floor((show - 3) / 2)
  )}`;
}

export const gasPercentage = (gasUsed: number, gasLimit: number): string =>
  `${Math.floor((gasUsed / gasLimit) * 100)}%`;

const reverse = (str: string) => str.split("").reverse().join("");

export const formatEth = (
  eth: string,
  unit: "eth" | "gwei" = "eth"
): string => {
  if (unit === "eth") {
    // return eth;
    return (
      new Decimal(eth)
        .div(new Decimal("1000000000000000000"))
        .toDecimalPlaces(3)
        .toString() + " Eth"
    );
  } else {
    return (
      new Decimal(eth)
        .div(new Decimal("1000000000"))
        .toDecimalPlaces(3)
        .toString() + " Gwei"
    );
  }
  // let reversedChunks = reverse(eth).match(/.{1,3}/g) ?? [];

  // let whole = null;
  // if (reversedChunks.length > 6) {
  //   whole = reversedChunks.slice(6);
  //   reversedChunks = reversedChunks.slice(0, 6);
  // }

  // return `${
  //   whole ? `${whole.reverse().map(reverse).join(",")}.` : ""
  // }${reversedChunks.reverse().map(reverse).join(",")} ${whole ? "ETH" : "Wei"}`;
};
