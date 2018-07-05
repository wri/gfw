import { createSelector } from 'reselect';
import qs from 'query-string';
import upperFirst from 'lodash/upperFirst';
import isEmpty from 'lodash/isEmpty';

// get list data
const getCategories = state => state.categories || null;
const getCategory = state => state.category || null;
const getLocation = state => state.payload || null;
const getSearch = state => state.search || null;
const getCountries = state => state.countries || null;
const getRegions = state => state.regions || null;
const getSubRegions = state => state.subRegions || null;

export const getLinks = createSelector(
  [getCategories, getCategory, getSearch],
  (categories, activeCategory, search) =>
    categories.map(category => {
      const newQuery = {
        ...qs.parse(search),
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
  [getCountries, getRegions, getSubRegions, getLocation],
  (countries, regions, subRegions, location) => {
    const { type, country, region, subRegion } = location;
    if (
      (isEmpty(countries) && country) ||
      (isEmpty(regions) && region) ||
      (isEmpty(subRegions) && subRegion)
    ) {
      return null;
    }
    const activeCountry = countries.find(c => c.value === country);
    const activeRegion = regions && regions.find(r => r.value === region);
    const activeSubRegion =
      subRegions && subRegions.find(s => s.value === subRegion);

    return !activeCountry
      ? `${upperFirst(type) || 'Global'} Dashboard`
      : `${activeSubRegion ? `${activeSubRegion.label}, ` : ''}${
        activeRegion ? `${activeRegion.label}, ` : ''
      }${activeCountry && activeCountry.label}`;
  }
);
