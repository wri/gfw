import { createSelector } from 'reselect';

import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import lowerCase from 'lodash/lowerCase';
import { sortByKey } from 'utils/data';

// get list data
const getData = state => state.data || null;
const getOptions = state => state.options || null;
const getConfig = state => state.config || null;
const getSettings = state => state.settings || null;
const getLocationNames = state => state.locationNames || null;
const getLocationWhitelist = state =>
  (state.payload.region ? state.regionWhitelist : state.countryWhitelist);

export const getOptionsSelectedMeta = createSelector(
  [getOptions, getSettings],
  (options, settings) => {
    if (!options) return null;
    const optionsMeta = {};
    Object.keys(settings).forEach(o => {
      const optionsKey = `${o}s`;
      if (options[optionsKey]) {
        optionsMeta[o] = options[optionsKey].find(
          opt => opt.value === settings[o]
        );
      }
    });
    return optionsMeta;
  }
);

// get options
export const getIndicators = createSelector(
  [getLocationWhitelist, getLocationNames, getConfig, getOptions],
  (locationWhitelist, locationNames, config, options) => {
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
        options.indicators
          .filter(
            i =>
              config.indicators.indexOf(i.value) > -1 &&
              whitelist.indexOf(i.value) > -1 &&
              i.value !== 'gadm28' &&
              (!config.type ||
                config.type === 'extent' ||
                (locationWhitelist[i.value] &&
                  locationWhitelist[i.value][config.type]))
          )
          .map(item => {
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

export const getUnits = createSelector(
  [getConfig, getOptions],
  (config, options) => {
    const units = options.units.filter(item =>
      config.units.includes(item.value)
    );
    return sortByKey(units, 'label');
  }
);

export const getWeeks = createSelector(
  [getConfig, getOptions],
  (config, options) => {
    if (!config || !config.weeks) return options.weeks;
    return options.weeks.filter(w => config.weeks.indexOf(w.value) > -1);
  }
);

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

export const getYears = createSelector([getConfig], config => {
  if (!config.years) return null;
  return config.years.map(d => ({
    label: d,
    value: d
  }));
});
