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
const getCountries = state => state.countries || null;
const getRegions = state => state.regions || null;
const getSubRegions = state => state.subRegions || null;
const getCategory = state => state.category || null;
const getLocation = state => state.payload || null;
const getLocationOptions = state => {
  const admin = getActiveAdmin(state.payload);
  return state[admin === 'country' ? 'regions' : 'subRegions'];
};
const getIndicatorWhitelist = state => state.indicatorWhitelist || null;
const getFAOCountries = state => state.faoCountries || null;

// helper to get active key for location
export const getActiveAdmin = location => {
  if (location.subRegion) return 'subRegion';
  if (location.region) return 'region';
  return 'country';
};

export const getActiveAdmins = ({ region, subRegion }) => {
  if (subRegion) return 'subRegions';
  if (region) return 'regions';
  return 'countries';
};

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
    optionsMeta[oKey] = sortByKey(options[oKey], 'label');
  });
  return optionsMeta;
};

// get lists selected
export const getAdminsSelected = createSelector(
  [getCountries, getRegions, getSubRegions, getLocation],
  (countries, regions, subRegions, location) => {
    const country =
      (countries && countries.find(i => i.value === location.country)) || null;
    const region =
      (regions && regions.find(i => i.value === location.region)) || null;
    const subRegion =
      (subRegions && subRegions.find(i => i.value === location.subRegion)) ||
      null;
    let current = country;
    if (location.subRegion) {
      current = subRegion;
    } else if (location.region) {
      current = region;
    }

    return {
      country,
      region,
      subRegion,
      current
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
  [filterWidgetsByCategory, getLocationOptions, getFAOCountries, getLocation],
  (widgets, locations, faoCountries, location) => {
    if (isEmpty(locations)) return null;
    const adminLevel = getActiveAdmin(location);
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
