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

export const formatEth = (eth: string): string => {
  let reversedChunks = reverse(eth).match(/.{1,3}/g) ?? [];

  let whole = null;
  if (reversedChunks.length > 6) {
    whole = reversedChunks.slice(6);
    reversedChunks = reversedChunks.slice(0, 6);
  }

  return `${
    whole ? `${whole.reverse().map(reverse).join(",")}.` : ""
  }${reversedChunks.reverse().map(reverse).join(",")} ${whole ? "ETH" : "Wei"}`;
};
