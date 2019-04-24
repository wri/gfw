import { createSelector, createStructuredSelector } from 'reselect';
import { getIsTrase } from 'app/layouts/root/selectors';
import compact from 'lodash/compact';

// get list data
const getSettings = (state, { settings }) => settings || null;
const getType = (state, { config }) => config.dataType || null;
const getNonGlobalDatasets = state =>
  (state.widgets && state.widgets.data.nonGlobalDatasets) || null;
const getIndicator = (state, { indicator }) => indicator || null;
const getForestType = (state, { settings }) => settings.forestType || null;
const getLandCategory = (state, { settings }) => settings.landCategory || null;
const getLocation = state => state.location && state.location.payload;

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

export const getWidgetFooterProps = createStructuredSelector({
  statement: getStatement,
  showAttributionLink: getIsTrase,
  type: getType
});
