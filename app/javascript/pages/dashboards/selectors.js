import { createSelector, createStructuredSelector } from 'reselect';
import replace from 'lodash/replace';
import qs from 'query-string';

import CATEGORIES from 'data/categories.json';

// get list data
const selectShowMap = state => state.dashboards.showMapMobile;
const selectCategory = state =>
  (state.location && state.location.query && state.location.query.category) ||
  'summary';
const selectQuery = state => (state.location && state.location.query) || null;
const selectPathname = state =>
  (state.location && state.location.pathname) || null;

export const getLinks = createSelector(
  [selectCategory, selectQuery, selectPathname],
  (activeCategory, query, pathname) =>
    CATEGORIES.map(category => {
      const newQuery = {
        ...query,
        category: category.value,
        widget: undefined
      };
      return {
        label: category.label,
        path: `${pathname}${newQuery ? '?' : ''}${qs.stringify(newQuery)}`,
        active: activeCategory === category.value
      };
    })
);

export const getWidgetAnchor = () => {
  const widgetHash =
    window.location.hash && replace(window.location.hash, '#', '');
  return document.getElementById(widgetHash);
};

export const getDashboardsProps = createStructuredSelector({
  showMapMobile: selectShowMap,
  category: selectCategory,
  links: getLinks,
  widgetAnchor: getWidgetAnchor
});
