import deburr from 'lodash/deburr';
import toUpper from 'lodash/toUpper';
import chroma from 'chroma-js';

export function deburrUpper(string) {
  return toUpper(deburr(string));
}

export const sortByKey = (array, key, isAsc) =>
  array.sort((a, b) => {
    if (!isAsc) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
    }
    if (a[key] > b[key]) return -1;
    if (a[key] < b[key]) return 1;
    return 0;
  });

export const getColorPalette = (colorRange, quantity) => {
  const trim = 0.5 / (quantity - 0.6);
  return chroma
    .scale(colorRange)
    .padding(trim)
    .colors(quantity);
};

export const getColorBuckets = colors => [
  {
    limit: 20,
    color: colors.ramp[8]
  },
  {
    limit: 40,
    color: colors.ramp[6]
  },
  {
    limit: 60,
    color: colors.ramp[4]
  },
  {
    limit: 80,
    color: colors.ramp[2]
  },
  {
    limit: 100,
    color: colors.ramp[0]
  }
];

export const getColorBucket = (buckets, value) =>
  buckets.find(c => value <= c.limit) || buckets[4];

export const flattenObj = (target, opts = {}) => {
  const delimiter = opts.delimiter || '.';
  const { maxDepth } = opts;
  const output = {};

  const step = (object, prev, currentDepth = 1) => {
    Object.keys(object).forEach(key => {
      const value = object[key];
      const isarray = opts.safe && Array.isArray(value);
      const type = Object.prototype.toString.call(value);
      const isobject = type === '[object Object]' || type === '[object Array]';

      const newKey = prev ? prev + delimiter + key : key;

      if (
        !isarray &&
        isobject &&
        Object.keys(value).length &&
        (!opts.maxDepth || currentDepth < maxDepth)
      ) {
        return step(value, newKey, currentDepth + 1);
      }

      output[newKey] = value;
      return false;
    });
  };

  step(target);

  return output;
};
