import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

const getCountries = state => state.countries;
const getIsos = state => state.isos;

export const getCountriesFromIsos = createSelector(
  [getCountries, getIsos],
  (countries, isos) => {
    if (isEmpty(countries) || isEmpty(isos)) return null;
    return countries
      .filter(c => isos.includes(c.value))
      .map(c => c.label)
      .join(', ');
  }
);
