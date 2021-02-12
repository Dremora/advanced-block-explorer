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

export const formatGas = (gas: string) => {
  const reversedChunks = reverse(gas).match(/.{1,3}/g) ?? [];

  // let whole = null;
  // if (reversedChunks.length > 6) {
  //   whole = reversedChunks.slice(6);
  //   reversedChunks = reversedChunks.slice(0, 6);
  // }

  return reversedChunks.reverse().map(reverse).join(",");
};

export const formatEth = (
  eth: string,
  unit: "eth" | "gwei" | "wei" = "eth"
): string => {
  if (eth === "NaN") {
    return "0 wei";
  }
  const ethDecimal = new Decimal(eth);
  if (ethDecimal.greaterThanOrEqualTo(new Decimal("1000000"))) {
    unit = "gwei";
  }
  if (ethDecimal.greaterThanOrEqualTo(new Decimal("1000000000000000"))) {
    unit = "eth";
  }
  if (unit === "eth") {
    // return eth;
    return (
      ethDecimal
        .div(new Decimal("1000000000000000000"))
        .toDecimalPlaces(3)
        .toString() + " Eth"
    );
  } else if (unit === "gwei") {
    return (
      ethDecimal.div(new Decimal("1000000000")).toDecimalPlaces(3).toString() +
      " Gwei"
    );
  } else {
    return ethDecimal.toString() + " wei";
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
