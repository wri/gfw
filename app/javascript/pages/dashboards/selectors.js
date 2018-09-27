import { createSelector } from 'reselect';
import qs from 'query-string';

// get list data
const getCategories = state => state.categories || null;
const getCategory = state => state.category || null;
const getSearch = state => state.search || null;

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
