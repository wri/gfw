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

const options = {
  indicators,
  thresholds,
  units,
  periods,
  extentYears,
  types,
  weeks
};

export const getAdminLevel = createSelector([getLocation], location => {
  if (location.subRegion) return 'subRegion';
  if (location.region) return 'region';
  if (location.country) return 'country';
  return 'global';
});

export const getAdminKey = createSelector([getLocation], location => {
  if (location.subRegion) return 'subRegions';
  if (location.region) return 'regions';
  return 'countries';
});

export const getLocationOptions = createSelector(
  [getAdminLevel, getCountryData],
  (admin, countryData) =>
    countryData[admin === 'country' ? 'regions' : 'subRegions']
);

export const getOptions = () => {
  const optionsMeta = {};
  Object.keys(options).forEach(oKey => {
    optionsMeta[oKey] =
      oKey !== 'weeks' ? sortByKey(options[oKey], 'label') : options[oKey];
  });
  return optionsMeta;
};

// get lists selected
export const getAdminSelected = createSelector(
  [getAdminLevel, getAdminKey, getCountryData, getLocation],
  (adminLevel, adminKey, locations, location) => {
    const current = locations[adminKey].find(
      i => i.value === location[adminLevel]
    );
    return {
      ...current,
      adminKey,
      adminLevel
    };
  }
);

// get lists selected
export const getWidgets = createSelector([], () =>
  Object.keys(WIDGETS).map(key => ({
    name: key,
    ...WIDGETS[key].initialState
  }))
);

export const filterWidgetsByCategory = createSelector(
  [getWidgets, getCategory],
  (widgets, category) =>
    sortBy(
      widgets.filter(
        w => w.enabled && w.config.categories.indexOf(category) > -1
      ),
      `config.sortOrder[${camelCase(category)}]`
    )
);

export const checkWidgetNeedsLocations = createSelector(
  [
    filterWidgetsByCategory,
    getLocationOptions,
    getCountryData,
    getLocation,
    getAdminLevel
  ],
  (widgets, locations, countryData, location, adminLevel) => {
    const { faoCountries } = countryData;
    const isFaoCountry =
      !!faoCountries.find(c => c.value === location.country) || null;
    return widgets.filter(
      w =>
        w.config.admins.indexOf(adminLevel) > -1 ||
        ((!w.config.locationCheck || (locations && locations.length > 1)) &&
          (w.config.type !== 'fao' || isFaoCountry) &&
          (!w.config.customLocationWhitelist ||
            w.config.customLocationWhitelist.indexOf(location.country) > -1))
    );
  }
);

export const filterWidgets = createSelector(
  [checkWidgetNeedsLocations, getIndicatorWhitelist, getAdminLevel],
  (widgets, whitelist, admin) => {
    if (!widgets) return null;
    if (admin === 'global') return widgets;
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
        type === 'emissions' ||
        type === 'plantations' ||
        type === 'fires' ||
        (whitelist && whitelist.gadm28 && whitelist.gadm28[type]);

      return showByIndicators && hasData;
    });
  }
);

export const getActiveWidget = createSelector(
  [filterWidgets, getWidgetQuery],
  (widgets, widgetQuery) => {
    if (!widgets || !widgets.length || widgetQuery === 'none') return null;
    if (!widgetQuery) return widgets[0];
    return widgets.find(w => w.name === widgetQuery);
  }
);
