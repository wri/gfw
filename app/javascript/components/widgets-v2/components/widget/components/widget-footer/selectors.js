import { createSelector } from 'reselect';
import compact from 'lodash/compact';

// get list data
const getSettings = state => state.settings || null;
const getType = state => state.config.type || null;
const getNonGlobalDatasets = state => state.nonGlobalDatasets || null;
const getIndicator = state => state.indicator || null;
const getForestType = state => state.forestType || null;
const getLandCategory = state => state.landCategory || null;
const getLocation = state => state.location || null;

export const getNonGlobalIndicator = createSelector(
  [
    getIndicator,
    getForestType,
    getLandCategory,
    getLocation,
    getNonGlobalDatasets
  ],
  (indicator, forestType, landCategory, location, datasets) => {
    if (!datasets || location.type !== 'global' || !indicator) return null;
    if (datasets[indicator.value]) {
      return indicator;
    } else if (datasets[forestType && forestType.value]) {
      return forestType;
    } else if (datasets[landCategory && landCategory.value]) {
      return landCategory;
    }
    return null;
  }
);

// get lists selected
export const getStatement = createSelector(
  [getSettings, getType, getNonGlobalDatasets, getNonGlobalIndicator],
  (settings, type, datasets, indicator) => {
    if (!settings) return '';
    const { extentYear, threshold } = settings;
    const statements = compact([
      extentYear ? `${extentYear} tree cover extent` : null,
      threshold || threshold === 0 ? `>${threshold}% tree canopy` : null,
      type === 'loss'
        ? 'these estimates do not take tree cover gain into account'
        : null,
      datasets && indicator
        ? `*${indicator.label.toLowerCase()} are available in ${
          datasets[indicator.value]
        } countries only`
        : null
    ]);

    return statements.join(' | ');
  }
);
