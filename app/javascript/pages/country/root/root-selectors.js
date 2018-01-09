import { createSelector } from 'reselect';
import compact from 'lodash/compact';
import qs from 'query-string';

import WIDGETS from 'pages/country/data/widgets-config.json';

// get list data
const getCategories = state => state.categories || null;
const getCategory = state => state.category || null;
const getAdminLevel = state => state.adminLevel || null;
const getLocation = state => state.location || null;
const getLocationOptions = state => state.locationOptions || null;

// get lists selected
export const getWidgets = createSelector(
  [getCategory, getAdminLevel, getLocationOptions],
  (category, adminLevel, locationOptions) => {
    if (!locationOptions) return null;
    const widgetKeys = Object.keys(WIDGETS);
    return widgetKeys
      .map(key => ({
        name: key,
        ...WIDGETS[key]
      }))
      .filter(
        widget =>
          widget.config.categories.indexOf(category) > -1 &&
          widget.config.admins.indexOf(adminLevel) > -1 &&
          (widget.config.renderCheck
            ? locationOptions[widget.config.renderCheck].length > 1
            : true) &&
          widget.active
      );
  }
);

export const getLinks = createSelector(
  [getCategories, getCategory, getLocation],
  (categories, activeCategory, location) =>
    categories.map(category => {
      const locationUrl = compact(
        Object.keys(location.payload).map(key => location.payload[key])
      ).join('/');
      const newQuery = {
        ...location.query,
        category: category.value
      };
      return {
        label: category.label,
        path: `/country/${locationUrl}?${qs.stringify(newQuery)}`,
        active: activeCategory === category.value
      };
    })
);
