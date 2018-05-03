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
const getState = state => state || null;
const getCategory = state => state.category || null;
const getLocation = state => state.payload || null;
const getIndicatorWhitelist = state => state.indicatorWhitelist || null;
const getFAOCountries = state => state.faoCountries || null;

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
  return 'country';
});

export const getLocationOptions = createSelector(
  [getAdminLevel, getState],
  (admin, state) => state[admin === 'country' ? 'regions' : 'subRegions']
);

export const getOptions = () => {
  const optionsMeta = {};
  Object.keys(options).forEach(oKey => {
    optionsMeta[oKey] = sortByKey(options[oKey], 'label');
  });
  return optionsMeta;
};

// get lists selected
export const getAdminSelected = createSelector(
  [getAdminLevel, getState, getLocation],
  (admin, state, location) => {
    if (isEmpty(state[admin])) return null;
    const current = state[admin].find(i => i.value === location[admin]);
    return {
      ...current,
      admin
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
    getFAOCountries,
    getLocation,
    getAdminLevel
  ],
  (widgets, locations, faoCountries, location, adminLevel) => {
    if (isEmpty(locations)) return null;
    const isFaoCountry =
      !!faoCountries.find(c => c.value === location.country) || null;
    return widgets.filter(
      w =>
        w.config.admins.indexOf(adminLevel) > -1 &&
        (!w.config.locationCheck || locations.length > 1) &&
        (w.config.type !== 'fao' || isFaoCountry) &&
        (!w.config.customLocationWhitelist ||
          w.config.customLocationWhitelist.indexOf(location.country) > -1)
    );
  }
);

export const filterWidgets = createSelector(
  [checkWidgetNeedsLocations, getIndicatorWhitelist],
  (widgets, whitelist) => {
    if (!widgets) return null;
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
