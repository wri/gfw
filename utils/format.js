import { format } from 'd3-format';

export const formatUSD = (value, minimize = true) =>
  format('.2s')(value)
    .replace('G', minimize ? 'B' : ' billion')
    .replace('M', minimize ? 'M' : ' million')
    .replace('K', minimize ? 'K' : ' thousand');

export const formatNumber = ({ num, unit, precision, returnUnit = true }) => {
  if (unit === '') return format('.2f')(num);
  if (unit === ',') return format(',')(num);
  let p = unit === '%' ? '2' : '3';
  if (unit === 'tCO2') return `${format('.3s')(num)}tCO\u2082e`;
  if (precision && Number.isInteger(precision)) p = Math.abs(precision);
  let numFormat = unit === '%' ? `.${p}r` : `.${p}s`;
  if (unit === 'counts') numFormat = ',.0f';
  const thres = unit === '%' ? 0.1 : 1;
  let formattedNum =
    num < thres && num > 0 ? `< ${thres}` : format(numFormat)(num);
  if (unit !== '%' && num < thres && num > 0.01) {
    formattedNum = format('.3r')(num);
  } else if (unit === 'ha' && num < 1000) {
    formattedNum = Math.round(num);
  } else if (num > 0 && num < 0.01 && unit !== '%') {
    formattedNum = '<0.01';
  }
  return `${formattedNum}${
    returnUnit && unit && unit !== 'counts' ? unit : ''
  }`;
};
