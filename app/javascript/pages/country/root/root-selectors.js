import { createSelector } from 'reselect';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import concat from 'lodash/concat';
import isEmpty from 'lodash/isEmpty';
import qs from 'query-string';
import sortBy from 'lodash/sortBy';
import replace from 'lodash/replace';

import WIDGETS from 'pages/country/data/widgets-config.json';

// get list data
const getCategories = state => state.categories || null;
const getCategory = state => state.category || null;
const getAdminLevel = state => state.adminLevel || null;
const getLocation = state => state.location || null;
const getLocationOptions = state => state.locationOptions || null;
const getIndicatorWhitelist = state => state.indicatorWhitelist || null;
const getFAOCountries = state => state.faoCountries || null;
const getWidgetQuery = state => state.activeWidget || null;

// get lists selected
export const getWidgets = createSelector([], () =>
  sortBy(
    Object.keys(WIDGETS).map(key => ({
      name: key,
      ...WIDGETS[key]
    })),
    'config.sortOrder'
  )
);

export const filterWidgetsByCategory = createSelector(
  [getWidgets, getCategory],
  (widgets, category) =>
    widgets.filter(w => w.active && w.config.categories.indexOf(category) > -1)
);

export const checkWidgetNeedsLocations = createSelector(
  [
    filterWidgetsByCategory,
    getLocationOptions,
    getAdminLevel,
    getFAOCountries,
    getLocation
  ],
  (widgets, locations, adminLevel, faoCountries, location) => {
    if (isEmpty(locations)) return null;
    const adminCheck = adminLevel === 'country' ? 'regions' : 'subRegions';
    const isFaoCountry =
      faoCountries.find(c => c.value === location.payload.country) || null;
    return widgets.filter(
      w =>
        w.config.admins.indexOf(adminLevel) > -1 &&
        (!w.config.locationCheck || locations[adminCheck].length > 1) &&
        (w.config.type !== 'fao' || isFaoCountry) &&
        (!w.config.customLocationWhitelist ||
          w.config.customLocationWhitelist.indexOf(location.payload.country) >
            -1)
    );
  }
);

export const filterWidgets = createSelector(
  [checkWidgetNeedsLocations, getIndicatorWhitelist],
  (widgets, whitelist) => {
    const whitelistKeys = !isEmpty(whitelist) ? Object.keys(whitelist) : null;

    return widgets.filter(widget => {
      // filter by showIndicators
      let showByIndicators = true;
      if (widget.config.showIndicators && whitelist) {
        const totalIndicators = concat(
          widget.config.showIndicators,
          whitelistKeys
        ).length;
        const reducedIndicators = uniq(
          concat(widget.config.showIndicators, whitelistKeys)
        ).length;
        showByIndicators = totalIndicators !== reducedIndicators;
      }
      // Then check if widget has data for gadm28 (loss or gain)
      const type = widget.config.type;
      const hasData =
        !type ||
        type === 'extent' ||
        type === 'fao' ||
        type === 'alerts' ||
        (whitelist && whitelist.gadm28 && whitelist.gadm28[type]);

      return showByIndicators && hasData;
    });
  }
);

export const getActiveWidget = createSelector(
  [filterWidgets, getWidgetQuery],
  (widgets, locationHash) => {
    if (!widgets || !widgets.length) return null;
    if (!locationHash) return widgets[0];
    return widgets.find(w => w.name === replace(locationHash), '#', '');
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
