import { createSelector } from 'reselect';
import { sortByKey } from 'utils/data';
import uniq from 'lodash/uniq';
import concat from 'lodash/concat';
import isEmpty from 'lodash/isEmpty';
import camelCase from 'lodash/camelCase';
import sortBy from 'lodash/sortBy';

import indicators from 'data/indicators.json';
import thresholds from 'data/thresholds.json';
import units from 'data/units.json';
import periods from 'data/periods.json';
import extentYears from 'data/extent-years.json';
import types from 'data/types.json';
import weeks from 'data/weeks.json';

import * as WIDGETS from 'components/widgets/manifest';

// get list data
const getCountryData = state => state.countryData || null;
const getCategory = state => state.category || null;
const getLocation = state => state.payload || null;
const getIndicatorWhitelist = state => state.indicatorWhitelist || null;
const getWidgetQuery = state => state.activeWidget || null;

// get all possible widget settings options
const options = {
  indicators,
  thresholds,
  units,
  periods,
  extentYears,
  types,
  weeks
};

export const getOptions = () => {
  const optionsMeta = {};
  Object.keys(options).forEach(oKey => {
    optionsMeta[oKey] =
      oKey !== 'weeks' ? sortByKey(options[oKey], 'label') : options[oKey];
  });
  return optionsMeta;
};

// get location data for filtering widgets
export const getAdminLevel = createSelector([getLocation], location => {
  const { type, country, region, subRegion } = location;
  if (subRegion) return 'subRegion';
  if (region) return 'region';
  if (country) return 'country';
  return type || 'global';
});

export const getAdminKey = createSelector([getLocation], location => {
  const { type, country, region, subRegion } = location;
  if (subRegion) return 'subRegions';
  if (region) return 'regions';
  if (country) return 'countries';
  return type || 'global';
});

export const getLocationOptions = createSelector(
  [getAdminLevel, getCountryData],
  (admin, countryData) =>
    countryData[admin === 'country' ? 'regions' : 'subRegions'] ||
    countryData.countries
);

export const getAdminSelected = createSelector(
  [getAdminLevel, getAdminKey, getCountryData, getLocation],
  (adminLevel, adminKey, locations, location) => {
    const current =
      locations[adminKey] &&
      locations[adminKey].find(i => i.value === location[adminLevel]);
    return {
      ...current,
      adminKey,
      adminLevel
    };
  }
);

// widget filters
export const getWidgets = createSelector([], () =>
  Object.keys(WIDGETS).map(key => ({
    name: key,
    ...WIDGETS[key].initialState
  }))
);

export const checkWidgetAdminLevel = createSelector(
  [getWidgets, getAdminLevel],
  (widgets, adminLevel) =>
    widgets.filter(w => w.config.admins.indexOf(adminLevel) > -1)
);

export const checkWidgetNeedsLocations = createSelector(
  [
    checkWidgetAdminLevel,
    getLocationOptions,
    getCountryData,
    getLocation,
    getAdminLevel
  ],
  (widgets, locations, countryData, location, adminLevel) => {
    if (adminLevel === 'global') return widgets;
    const { faoCountries } = countryData;
    const isFaoCountry =
      !!faoCountries.find(c => c.value === location.country) || null;

    return widgets.filter(w => {
      const { locationCheck, type, locationWhitelist } = w.config;
      const needsLocations =
        !locationCheck || (locations && locations.length > 1);
      const locationWhitelistCheck =
        !locationWhitelist || locationWhitelist.indexOf(location.country) > -1;
      const faoLocationCheck = type !== 'fao' || isFaoCountry;

      return needsLocations && locationWhitelistCheck && faoLocationCheck;
    });
  }
);

export const filterWidgetByIndicator = createSelector(
  [checkWidgetNeedsLocations, getIndicatorWhitelist, getAdminLevel],
  (widgets, whitelist, admin) => {
    if (!widgets) return null;
    if (admin === 'global') return widgets;
    const whitelistKeys = !isEmpty(whitelist) ? Object.keys(whitelist) : null;

    return widgets.filter(widget => {
      const { showIndicators } = widget.config;
      let showByIndicators = true;
      if (showIndicators && whitelist) {
        const totalIndicators = concat(showIndicators, whitelistKeys).length;
        const reducedIndicators = uniq(concat(showIndicators, whitelistKeys))
          .length;
        showByIndicators = totalIndicators !== reducedIndicators;
      }
      return showByIndicators;
    });
  }
);

export const checkWidgetHasData = createSelector(
  [filterWidgetByIndicator, getIndicatorWhitelist, getAdminLevel],
  (widgets, whitelist, admin) => {
    if (admin === 'global') return widgets;
    return widgets.filter(w => {
      const { type } = w.config;
      return (
        type !== 'loss' ||
        type !== 'gain' ||
        (whitelist && whitelist.gadm28 && whitelist.gadm28[type])
      );
    });
  }
);

export const filterWidgets = createSelector(
  [checkWidgetHasData, getCategory],
  (widgets, category) =>
    sortBy(
      widgets.filter(
        w => w.enabled && w.config.categories.indexOf(category) > -1
      ),
      `config.sortOrder[${camelCase(category)}]`
    )
);

export const getActiveWidget = createSelector(
  [filterWidgets, getWidgetQuery],
  (widgets, widgetQuery) => {
    if (!widgets || !widgets.length || widgetQuery === 'none') return null;
    if (!widgetQuery) return widgets[0];
    return widgets.find(w => w.name === widgetQuery);
  }
);
