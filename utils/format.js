import { format } from 'd3-format';

export const formatUSD = (value, minimize = true) =>
  format('.2s')(value)
    .replace('G', minimize ? 'B' : ' billion')
    .replace('M', minimize ? 'M' : ' million')
    .replace('K', minimize ? 'K' : ' thousand');

const setDefaultSpecifier = (unit, precision) => {
  let defaultSpecifier = '';
  const numberOfDecimalDigits = unit === '%' ? '2' : '3';
  const properPrecision = Number.isInteger(precision)
    ? Math.abs(precision)
    : numberOfDecimalDigits;

  defaultSpecifier =
    unit === '%' ? `.${properPrecision}r` : `.${properPrecision}s`;
  defaultSpecifier = unit === 'counts' ? ',.0f' : defaultSpecifier;

  return defaultSpecifier;
};

const formatWithProperSpecifier = ({
  num,
  unit,
  precision,
  specialSpecifier = null,
}) => {
  const defaultSpecifier = setDefaultSpecifier(unit, precision);
  const threshold = unit === '%' ? 0.1 : 1;

  // specialSpecifier is a different specifier passed through formatNumber parameter
  // e.g formatNumber({ num: 12.345, specialSpecifier: value < 1 ? '.3r' : '.3s'; })
  if (specialSpecifier) {
    return format(specialSpecifier)(num);
  }

  if (unit === 'tCO2') {
    return format('.3s')(num);
  }

  if (num < threshold && num > 0) {
    return `< ${threshold}`;
  }

  if (unit !== '%' && num < threshold && num > 0.01) {
    return format('.3r')(num);
  }

  if (unit === 'ha' && num < 1000 && num > 0) {
    return Math.round(num);
  }

  if (unit !== '%' && num > 0 && num < 0.01) {
    return '<0.01';
  }

  return format(defaultSpecifier)(num);
};

export const formatNumber = (args) => {
  const { num, unit, returnUnit = true, spaceUnit = false, suffix = '' } = args;

  if (unit === '') return format('.2f')(num);
  if (unit === ',') return format(',')(num);

  let formattedNumber = formatWithProperSpecifier(args);

  if (unit === 'tCO2') {
    formattedNumber = `${formattedNumber}tCO\u2082e`;
  }

  if (suffix !== '') {
    formattedNumber = `${formattedNumber} ${suffix}`;
  }

  if (spaceUnit) {
    // Capture group until first occurrence of a non digit or dot or comma.
    // and insert a space after the captured group.
    formattedNumber = String(formattedNumber).replace(/([\d|.|,]+)/, '$1 ');
  }

  return `${formattedNumber}${
    returnUnit &&
    unit &&
    unit !== 'counts' &&
    unit !== 'tCO2' &&
    unit !== 'countsK'
      ? unit
      : ''
  }`;
};
