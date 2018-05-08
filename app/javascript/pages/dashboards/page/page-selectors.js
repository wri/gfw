import { createSelector } from 'reselect';
import qs from 'query-string';

// get list data
const getCategories = state => state.categories || null;
const getCategory = state => state.category || null;
const getLocation = state => state.payload || null;
const getQuery = state => state.query || null;
const getCountries = state => state.countries || null;
const getRegions = state => state.regions || null;
const getSubRegions = state => state.subRegions || null;

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
export const getAdminsSelected = createSelector(
  [getCountries, getRegions, getSubRegions, getLocation],
  (countries, regions, subRegions, location) => {
    const country =
      (countries && countries.find(i => i.value === location.country)) || null;
    const region =
      (regions && regions.find(i => i.value === location.region)) || null;
    const subRegion =
      (subRegions && subRegions.find(i => i.value === location.subRegion)) ||
      null;
    let current = country;
    if (location.subRegion) {
      current = subRegion;
    } else if (location.region) {
      current = region;
    }

    return {
      ...current,
      country,
      region,
      subRegion
    };
  }
);
