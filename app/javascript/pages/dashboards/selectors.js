import { createSelector, createStructuredSelector } from 'reselect';
import replace from 'lodash/replace';
import upperFirst from 'lodash/upperFirst';

import CATEGORIES from 'data/categories.json';

// get list data
const selectShowMap = state => state.map.showMapMobile;
const selectCategory = state =>
  (state.location && state.location.query && state.location.query.category) ||
  'summary';

export const getLinks = createSelector([selectCategory], activeCategory =>
  CATEGORIES.map(category => ({
    label: category.label,
    category: category.value,
    active: activeCategory === category.value
  }))
);

export const getWidgetAnchor = () => {
  const widgetHash =
    window.location.hash && replace(window.location.hash, '#', '');
  return document.getElementById(widgetHash);
};

export const getNoWidgetsMessage = createSelector(
  [selectCategory],
  category => `${upperFirst(category)} data for {location} coming soon`
);

export const getDashboardsProps = createStructuredSelector({
  showMapMobile: selectShowMap,
  category: selectCategory,
  links: getLinks,
  widgetAnchor: getWidgetAnchor,
  noWidgetsMessage: getNoWidgetsMessage
});
