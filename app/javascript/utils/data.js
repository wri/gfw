import deburr from 'lodash/deburr';
import toUpper from 'lodash/toUpper';

export function deburrUpper(string) {
  return toUpper(deburr(string));
}

export const sortLabelByAlpha = array =>
  array.sort((a, b) => {
    if (a.label < b.label) return -1;
    if (a.label > b.label) return 1;
    return 0;
  });
