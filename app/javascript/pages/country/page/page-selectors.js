import { createSelector } from 'reselect';
import compact from 'lodash/compact';
import qs from 'query-string';

// get list data
const getCategories = state => state.categories || null;
const getCategory = state => state.category || null;
const getLocation = state => state.payload || null;
const getQuery = state => state.query || null;

export const getLinks = createSelector(
  [getCategories, getCategory, getLocation, getQuery],
  (categories, activeCategory, location, query) =>
    categories.map(category => {
      const locationUrl = compact(
        Object.keys(location).map(key => location[key])
      ).join('/');
      const newQuery = {
        ...query,
        category: category.value,
        widget: undefined
      };
      return {
        label: category.label,
        path: `/country/${locationUrl}?${qs.stringify(newQuery)}`,
        active: activeCategory === category.value
      };
    })
);
