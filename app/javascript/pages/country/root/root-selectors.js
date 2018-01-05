import { createSelector } from 'reselect';

import WIDGETS from 'pages/country/data/widgets-config.json';

// get list data
const getCategory = state => state.category || null;
const getAdminLevel = state => state.adminLevel || null;

// get lists selected
export const getWidgets = createSelector(
  [getCategory, getAdminLevel],
  (category, adminLevel) => {
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
          widget.active
      );
  }
);
