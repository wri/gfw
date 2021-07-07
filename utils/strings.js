import deburr from 'lodash/deburr';
import toUpper from 'lodash/toUpper';

export const deburrUpper = (string) => toUpper(deburr(string));

export function parseStringWithVars(str, vars) {
  return str
    .split(' ')
    .map((value) => {
      const serialize = value.replace(/{|}/g, '');
      if (vars[serialize]) {
        return vars[serialize];
      }
      return value;
    })
    .join(' ');
}
