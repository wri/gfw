import { createSelector, createStructuredSelector } from 'reselect';
import upperFirst from 'lodash/upperFirst';
import isEmpty from 'lodash/isEmpty';
import flatMap from 'lodash/flatMap';

import { filterWidgetsByLocation } from 'components/widgets/selectors';
import {
  getActiveArea,
  selectAreaLoading
} from 'providers/areas-provider/selectors';

import CATEGORIES from 'data/categories.json';

// get list data
const selectShowMap = state =>
  state.location && state.location.query && !!state.location.query.showMap;
const selectLocation = state => state.location;
const selectLocationType = state =>
  state.location && state.location.payload && state.location.payload.type;
const selectCategory = state =>
  (state.location && state.location.query && state.location.query.category) ||
  'summary';
export const selectQuery = state => state.location && state.location.query;

export const getEmbed = createSelector(
  [selectLocation],
  location => location && location.routesMap[location.type].embed
);

export const getWidgetAnchor = createSelector(
  [selectQuery, filterWidgetsByLocation],
  (query, widgets) => {
    const { scrollTo } = query || {};
    const hasWidget =
      widgets && widgets.length && widgets.find(w => w.widget === scrollTo);

    return hasWidget ? document.getElementById(scrollTo) : null;
  }
);

export const getNoWidgetsMessage = createSelector(
  [selectCategory],
  category => `${upperFirst(category)} data for {location} coming soon`
);

export const getLinks = createSelector(
  [filterWidgetsByLocation, selectCategory, getActiveArea],
  (widgets, activeCategory, activeArea) => {
    if (!widgets || (activeArea && isEmpty(activeArea.admin))) {
      return null;
    }
    const widgetCats = flatMap(widgets.map(w => w.categories));
    return CATEGORIES.filter(c => widgetCats.includes(c.value)).map(
      category => ({
        label: category.label,
        category: category.value,
        active: activeCategory === category.value
      })
    );
  }
);

export const getDashboardsProps = createStructuredSelector({
  showMapMobile: selectShowMap,
  category: selectCategory,
  links: getLinks,
  widgetAnchor: getWidgetAnchor,
  noWidgetsMessage: getNoWidgetsMessage,
  locationType: selectLocationType,
  activeArea: getActiveArea,
  areaLoading: selectAreaLoading,
  widgets: filterWidgetsByLocation
});
