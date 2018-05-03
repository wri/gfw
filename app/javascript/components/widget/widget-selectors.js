import { createSelector } from 'reselect';

import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import lowerCase from 'lodash/lowerCase';
import upperFirst from 'lodash/upperFirst';
import { sortByKey } from 'utils/data';

import INDICATORS from 'data/indicators.json';
import THRESHOLDS from 'data/thresholds.json';
import UNITS from 'data/units.json';
import PERIODS from 'data/periods.json';
import EXTENT_YEARS from 'data/extent-years.json';
import TYPES from 'data/types.json';
import WEEKS from 'data/weeks.json';

// get list data
const getState = state => state || null;
const getAdmins = state => state.payload || null;
const getCountries = state => state.countries || null;
const getRegions = state => state.regions || null;
const getSubRegions = state => state.subRegions || null;
const getData = state => state.data || null;
const getConfig = state => state.config || null;
const getSettings = state => state.settings || null;
const getLocationWhitelist = state =>
  (state.payload.region ? state.regionWhitelist : state.countryWhitelist);

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

// helper to get active filter from state based on key
export const getActiveFilter = (settings, filters, key) =>
  (filters ? filters.find(i => i.value === settings[key]) : null);

export const getActiveIndicator = indicator =>
  INDICATORS.find(i => i.value === indicator);

// get lists selected
export const getAdminsSelected = createSelector(
  [getCountries, getRegions, getSubRegions, getAdmins],
  (countries, regions, subRegions, adminsSelected) => {
    const country =
      (countries && countries.find(i => i.value === adminsSelected.country)) ||
      null;
    const region =
      (regions && regions.find(i => i.value === adminsSelected.region)) || null;
    const subRegion =
      (subRegions &&
        subRegions.find(i => i.value === adminsSelected.subRegion)) ||
      null;
    let current = country;
    if (adminsSelected.subRegion) {
      current = subRegion;
    } else if (adminsSelected.region) {
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

// get options
export const getIndicators = createSelector(
  [getLocationWhitelist, getAdminsSelected, getConfig],
  (locationWhitelist, locationNames, config) => {
    if (
      isEmpty(locationNames) ||
      !locationNames.current ||
      isEmpty(locationWhitelist)
    ) {
      return null;
    }
    const whitelist = Object.keys(locationWhitelist);

    return sortByKey(
      sortByKey(
        INDICATORS.filter(
          i =>
            config.indicators.indexOf(i.value) > -1 &&
            whitelist.indexOf(i.value) > -1 &&
            i.value !== 'gadm28' &&
            (!config.type ||
              config.type === 'extent' ||
              (locationWhitelist[i.value] &&
                locationWhitelist[i.value][config.type]))
        ).map(item => {
          const indicator = item;
          if (indicator.metaKey === 'primary_forest') {
            indicator.metaKey = `${lowerCase(locationNames.country.value)}_${
              indicator.metaKey
            }${locationNames.country.value === 'IDN' ? 's' : ''}`;
          }
          return indicator;
        }),
        'label'
      ),
      'category'
    );
  }
);

export const getThresholds = createSelector([], () =>
  sortByKey(THRESHOLDS, 'value')
);

export const getUnits = createSelector([getConfig], config => {
  const units = UNITS.filter(item => config.units.includes(item.value));
  return sortByKey(units, 'label');
});

export const getTypes = createSelector([], () => sortByKey(TYPES, 'label'));

export const getExtentYears = createSelector([], () => EXTENT_YEARS);

export const getWeeks = createSelector([getConfig], config => {
  if (!config || !config.weeks) return WEEKS;
  return WEEKS.filter(w => config.weeks.indexOf(w.value) > -1);
});

export const getRangeYears = createSelector(
  [getData, getConfig],
  (data, config) => {
    if (isEmpty(data)) return null;
    const yearsData = data.loss || data.lossByRegion[0].loss || data;
    return uniq(yearsData.map(d => d.year))
      .filter(
        d =>
          !config.yearRange ||
          (d >= config.yearRange[0] && d <= config.yearRange[1])
      )
      .map(d => ({
        label: d,
        value: d
      }));
  }
);

export const getStartYears = createSelector(
  [getRangeYears, getSettings],
  (years, settings) => {
    if (isEmpty(years)) return null;
    const { endYear } = settings;
    return years.filter(y => y.value <= endYear);
  }
);

export const getEndYears = createSelector(
  [getRangeYears, getSettings],
  (years, settings) => {
    if (isEmpty(years)) return null;
    const { startYear } = settings;
    return years.filter(y => y.value >= startYear);
  }
);

export const getPeriods = createSelector([], () => PERIODS);

export const getYears = createSelector([getConfig], config => {
  if (!config.years) return null;
  return config.years.map(d => ({
    label: d,
    value: d
  }));
});

const selectorFuncs = {
  getIndicators,
  getThresholds,
  getUnits,
  getTypes,
  getExtentYears,
  getWeeks,
  getRangeYears,
  getStartYears,
  getEndYears,
  getPeriods,
  getYears
};

export const getOptions = createSelector([getState], state => {
  const { config } = state;
  if (!config || !config.selectors) return null;
  const options = {};
  config.selectors.forEach(selector => {
    const selectorFunc = selectorFuncs[`get${upperFirst(selector)}`];
    options[selector] = selectorFunc({ ...state });
  });
  return options;
});
