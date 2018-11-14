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

export const flattenObj = (target, opts = {}) => {
  const delimiter = opts.delimiter || '.';
  const maxDepth = opts.maxDepth;
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
