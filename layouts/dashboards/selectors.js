import { createSelector, createStructuredSelector } from 'reselect';
import upperFirst from 'lodash/upperFirst';

import { encodeQueryParams } from 'utils/url';

import {
  filterWidgetsByLocation,
  getWidgetCategories,
  selectCategory,
} from 'components/widgets/selectors';
import { getActiveArea } from 'providers/areas-provider/selectors';

import CATEGORIES from 'data/categories.json';

// get list data
const selectShowMap = (state) => state.widgets?.showMap;
const selectLocation = (state) => state.location;
const selectLocationType = (state) =>
  state.location && state.location.payload && state.location.payload.type;
export const selectQuery = (state) => state.location && state.location.query;

export const getEmbed = createSelector(
  [selectLocation],
  (location) => location && location.pathname.includes('/embed')
);

export const getWidgetAnchor = createSelector(
  [selectQuery, filterWidgetsByLocation],
  (query, widgets) => {
    const { scrollTo } = query || {};
    const hasWidget =
      widgets && widgets.length && widgets.find((w) => w.widget === scrollTo);

    return hasWidget ? document.getElementById(scrollTo) : null;
  }
);

export const getNoWidgetsMessage = createSelector(
  [selectCategory],
  (category) => `${upperFirst(category)} data for {location} coming soon`
);

export const getLinks = createSelector(
  [getWidgetCategories, selectCategory, selectLocation],
  (widgetCats, activeCategory, location) => {
    const serializePayload = Object.values(location.payload).filter(
      (p) => p && p.toString().length
    );

    function formatQuery(category) {
      const encodedQueryString = encodeQueryParams({
        ...location.query,
        ...(category.value !== 'summary' && {
          category: category.value,
        }),
        ...(category.value === 'summary' && {
          category: undefined,
        }),
        widget: null,
        scrollTo: null,
      });
      return encodedQueryString.length > 0 ? `?${encodedQueryString}` : '';
    }

    if (!widgetCats || widgetCats?.length === 0) {
      return CATEGORIES.map((category) => ({
        label: category.label,
        category: category.value,
        href: location.pathname,
        shallow: true,
        as: `${location.pathname.replace(
          '[[...location]]',
          serializePayload.join('/')
        )}${formatQuery(category)}`,
      }));
    }

    return CATEGORIES.filter((c) => widgetCats.includes(c.value)).map(
      (category) => {
        return {
          label: category.label,
          category: category.value,
          href: location.pathname,
          shallow: true,
          as: `${location.pathname.replace(
            '[[...location]]',
            serializePayload.join('/')
          )}${formatQuery(category)}`,
          active: activeCategory === category.value,
        };
      }
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
  widgets: filterWidgetsByLocation,
});
