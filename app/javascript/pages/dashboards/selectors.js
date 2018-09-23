import { createSelector, createStructuredSelector } from 'reselect';
import qs from 'query-string';
import replace from 'lodash/replace';

import CATEGORIES from 'data/categories.json';

// get list data
const selectShowMap = state => state.dashboards.showMapMobile || null;
const selectCategory = state =>
  (state.location && state.location.query && state.location.query.category) ||
  'summary';
const selectSearch = state => state.search || null;

export const getLinks = createSelector(
  [selectCategory, selectSearch],
  (activeCategory, search) =>
    CATEGORIES.map(category => {
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
