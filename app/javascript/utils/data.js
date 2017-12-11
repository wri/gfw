import deburr from 'lodash/deburr';
import toUpper from 'lodash/toUpper';

export function deburrUpper(string) {
  return toUpper(deburr(string));
}

export const sortByKey = (array, key, isAsc) =>
  array.sort((a, b) => {
    if (isAsc) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
    }
    if (a[key] > b[key]) return -1;
    if (a[key] < b[key]) return 1;
    return 0;
  });
