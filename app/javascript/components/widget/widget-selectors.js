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
const getAdmins = state => state.location || null;
const getCountries = state => state.countries || null;
const getRegions = state => state.regions || null;
const getSubRegions = state => state.subRegions || null;
const getData = state => state.data || null;
const getStartYear = state => state.startYear || null;
const getEndYear = state => state.endYear || null;
const getConfig = state => state.config || null;
const getWaterBodies = state => state.waterBodies || null;
const getCountryData = state => state.countryData || null;
const getWhitelists = state => state.whitelists || null;
const getSettings = state => state.settings || null;
const getLocationWhitelist = state =>
  (state.location.region ? state.regionWhitelist : state.countryWhitelist);

// helper to get active key for location
export const getActiveAdmin = location => {
  if (location.subRegion) return 'subRegion';
  if (location.region) return 'region';
  return 'country';
};

// helper to get active filter from state based on key
export const getActiveFilter = (settings, filters, key) =>
  (filters ? filters.find(i => i.value === settings[key]) : null);

export const getActiveIndicator = indicator =>
  INDICATORS.find(i => i.value === indicator);

export const getLocationLabel = (location, indicator, indicators) => {
  if (!location || !indicators || !indicators.length) return '';
  const activeIndicator = indicators.find(i => i.value === indicator);
  return activeIndicator.value === 'gadm28'
    ? location
    : `${activeIndicator.label} in ${location}`;
};

// get lists selected
export const getAdminsOptions = createSelector(
  [getAdmins, getCountries, getRegions, getSubRegions, getWaterBodies],
  (location, countries, regions, subRegions, waterBodies) => {
    const activeWaterBodies =
      waterBodies &&
      waterBodies[location.country] &&
      waterBodies[location.country].filter(
        w => w.adm1 === parseInt(location.region, 10)
      );
    const waterBodiesIds =
      activeWaterBodies && activeWaterBodies.map(w => w.adm2);

    return {
      countries:
        (countries &&
          sortByKey(countries.filter(c => c.value !== 'XCA'), 'label')) ||
        null,
      regions: regions && sortByKey(regions, 'label'),
      subRegions:
        subRegions &&
        sortByKey(
          waterBodiesIds
            ? subRegions.filter(s => waterBodiesIds.indexOf(s.value) === -1)
            : subRegions,
          'label'
        )
    };
  }
);

export const getAdminsSelected = createSelector(
  [getAdminsOptions, getAdmins],
  (options, adminsSelected) => {
    const country =
      (options.countries &&
        options.countries.find(i => i.value === adminsSelected.country)) ||
      null;
    const region =
      (options.regions &&
        options.regions.find(i => i.value === adminsSelected.region)) ||
      null;
    const subRegion =
      (options.subRegions &&
        options.subRegions.find(i => i.value === adminsSelected.subRegion)) ||
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
    if (isEmpty(data) || !data.length) return null;

    return uniq(data.map(d => d.year))
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
  [getRangeYears, getEndYear],
  (years, endYear) => {
    if (isEmpty(years) || !endYear) return null;
    return years.filter(y => y.value <= endYear);
  }
);

export const getEndYears = createSelector(
  [getRangeYears, getStartYear],
  (years, startYear) => {
    if (isEmpty(years) || !startYear) return null;
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

export const getOptions = createSelector(
  [getConfig, getSettings, getAdmins, getCountryData, getWhitelists, getData],
  (config, settings, location, countryData, whitelists, data) => {
    if (!config || !config.selectors) return null;
    const options = {};
    config.selectors.forEach(selector => {
      const selectorFunc = selectorFuncs[`get${upperFirst(selector)}`];
      switch (selector) {
        case 'indicators':
          options[selector] = selectorFunc({
            config,
            location,
            ...countryData,
            ...whitelists
          });
          break;
        case 'years':
        case 'units':
          options[selector] = selectorFunc({
            config,
            ...settings
          });
          break;
        case 'startYears':
        case 'endYears':
          options[selector] = selectorFunc({
            config,
            data: data.loss || (data.regions && data.regions[0].loss),
            ...settings
          });
          break;
        default:
          options[selector] = selectorFunc({ config });
      }
    });
    return options;
  }
);
