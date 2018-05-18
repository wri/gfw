import { createSelector } from 'reselect';
import qs from 'query-string';
import upperFirst from 'lodash/upperFirst';
import isEmpty from 'lodash/isEmpty';

// get list data
const getCategories = state => state.categories || null;
const getCategory = state => state.category || null;
const getLocation = state => state.payload || null;
const getQuery = state => state.query || null;
const getCountries = state => state.countries || null;

export const getLinks = createSelector(
  [getCategories, getCategory, getLocation, getQuery],
  (categories, activeCategory, location, query) =>
    categories.map(category => {
      const newQuery = {
        ...query,
        category: category.value,
        widget: undefined
      };
      return {
        label: category.label,
        path: `${window.location.pathname}${newQuery ? '?' : ''}${qs.stringify(
          newQuery
        )}`,
        active: activeCategory === category.value
      };
    })
);

// get lists selected
export const getTitle = createSelector(
  [getCountries, getLocation],
  (countries, location) => {
    const { type, country } = location;
    if (isEmpty(countries) && country) return null;
    const activeCountry = countries.find(c => c.value === country);

    return !activeCountry
      ? `${upperFirst(type) || 'Global'} Dashboard`
      : activeCountry && activeCountry.label;
  }
);
