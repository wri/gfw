import { format } from 'd3-format';

const formatNumber = format('.2f');
const formatBillion = x => `${formatNumber(x / 1e9)} billion`;
const formatMillion = x => `${formatNumber(x / 1e6)} million`;
const formatThousand = x => `${formatNumber(x / 1e3)} thousand`;

export const formatCurrency = x => {
  const value = Math.abs(x);
  if (value >= 0.9995e9) {
    return formatBillion(x);
  } else if (value >= 0.9995e6) {
    return formatMillion(x);
  }
  return formatThousand(x);
};
