export function formatHashWithEllipsis(text: string, show = 20) {
  if (text.length < show) {
    return text;
  }

  return `${text.substr(0, Math.ceil((show - 3) / 2))}…${text.substr(
    -Math.floor((show - 3) / 2)
  )}`;
}
