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
