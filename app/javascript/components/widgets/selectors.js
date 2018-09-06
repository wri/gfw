import { createSelector } from 'reselect';
import { sortByKey } from 'utils/data';
import uniq from 'lodash/uniq';
import concat from 'lodash/concat';
import camelCase from 'lodash/camelCase';
import sortBy from 'lodash/sortBy';

import forestTypes from 'data/forest-types.json';
import landCategories from 'data/land-categories.json';
import thresholds from 'data/thresholds.json';
import units from 'data/units.json';
import periods from 'data/periods.json';
import extentYears from 'data/extent-years.json';
import tscDriverGroups from 'data/tsc-loss-groups.json';
import types from 'data/types.json';
import weeks from 'data/weeks.json';
import datasets from 'data/datasets.json';

import * as WIDGETS from 'components/widgets/manifest';

// get list data
const getCountryData = state => state.countryData || null;
const getCategory = state => state.category || null;
const getLocation = state => state.payload || null;
const getWhitelist = state => state.whitelist || null;
const getWidgetQuery = state => state.activeWidget || null;
const getCountries = state => state.countries || null;
const getRegions = state => state.regions || null;
const getSubRegions = state => state.subRegions || null;

// get all possible widget settings options
const options = {
  forestTypes,
  landCategories,
  thresholds,
  units,
  periods,
  extentYears,
  tscDriverGroups,
  types,
  weeks,
  datasets
};

export const getOptions = () => {
  const optionsMeta = {};
  Object.keys(options).forEach(oKey => {
    optionsMeta[oKey] =
      oKey === 'weeks' ? options[oKey] : sortByKey(options[oKey], 'label');
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
  [
    getCountries,
    getRegions,
    getSubRegions,
    getLocation,
    getAdminKey,
    getAdminLevel
  ],
  (countries, regions, subRegions, location, adminKey, adminLevel) => {
    const country =
      (countries && countries.find(i => i.value === location.country)) || null;
    const region =
      (regions && regions.find(i => i.value === location.region)) || null;
    const subRegion =
      (subRegions && subRegions.find(i => i.value === location.subRegion)) ||
      null;
    const type = {
      label: location.type || 'global',
      value: location.type || 'global'
    };

    let current = type;
    let parentLevel = null;
    let parentKey = null;
    let childLevel = 'country';
    let childKey = 'countries';
    if (location.subRegion) {
      current = subRegion;
      parentKey = 'regions';
      parentLevel = 'region';
    } else if (location.region) {
      current = region;
      parentKey = 'countries';
      parentLevel = 'country';
      childKey = 'subRegions';
      childLevel = 'subRegion';
    } else if (location.country) {
      current = country;
      parentKey = 'global';
      childKey = 'regions';
      childLevel = 'region';
    }

    return {
      type,
      country,
      region,
      subRegion,
      ...current,
      adminKey,
      adminLevel,
      parentKey,
      parentLevel,
      childKey,
      childLevel
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
  [checkWidgetNeedsLocations, getWhitelist, getAdminLevel],
  (widgets, whitelist, admin) => {
    if (!widgets) return null;
    if (admin === 'global') return widgets;

    return widgets.filter(widget => {
      const { showIndicators } = widget.config;
      let showByIndicators = true;
      if (showIndicators && whitelist) {
        const totalIndicators = concat(showIndicators, whitelist).length;
        const reducedIndicators = uniq(concat(showIndicators, whitelist))
          .length;
        showByIndicators = totalIndicators !== reducedIndicators;
      }
      return showByIndicators;
    });
  }
);

export const filterWidgets = createSelector(
  [filterWidgetByIndicator, getCategory],
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
