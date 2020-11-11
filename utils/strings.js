import deburr from 'lodash/deburr';
import toUpper from 'lodash/toUpper';

export const deburrUpper = (string) => toUpper(deburr(string));
