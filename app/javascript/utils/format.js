import { format } from 'd3-format';

const formatNumber = format('.2f');
const formatBillion = (x, min) =>
  `${formatNumber(x / 1e9)}${min ? 'B' : ' billion'}`;
const formatMillion = (x, min) =>
  `${formatNumber(x / 1e6)}${min ? 'M' : ' million'}`;
const formatThousand = (x, min) =>
  `${formatNumber(x / 1e3)}${min ? 'K' : ' thousand'}`;

export const formatCurrency = (x, min = true) => {
  const value = Math.abs(x);
  if (value >= 0.9995e9) {
    return formatBillion(x, min);
  } else if (value >= 0.9995e6) {
    return formatMillion(x, min);
  }
  return formatThousand(x, min);
};
