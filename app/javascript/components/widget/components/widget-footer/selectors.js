import { createSelector, createStructuredSelector } from 'reselect';
import { getIsTrase } from 'app/layouts/root/selectors';
import compact from 'lodash/compact';
import { translateText } from 'utils/transifex';

// get list data
const getSettings = state => state.settings;
const getDataType = state => state.dataType;
const getLocationType = state => state.locationType;
const getNonGlobalDatasets = state => state.nonGlobalDatasets;
const getIndicator = state => state.indicator;
const getForestType = state => state.forestType;
const getLandCategory = state => state.landCategory;

export const getNonGlobalIndicator = createSelector(
  [
    getIndicator,
    getForestType,
    getLandCategory,
    getLocationType,
    getNonGlobalDatasets
  ],
  (indicator, forestType, landCategory, type, datasets) => {
    if (!datasets || type !== 'global' || !indicator) return null;

    const forestTypeCount = datasets[forestType && forestType.value];
    const landCategoryCount = datasets[landCategory && landCategory.value];

    const indicators = [];
    if (forestTypeCount) {
      indicators.push({
        label: forestType.label,
        count: forestTypeCount
      });
    }
    if (landCategoryCount) {
      indicators.push({
        label: landCategory.label,
        count: landCategoryCount
      });
    }

    return indicators;
  }
);

// get lists selected
export const getStatements = createSelector(
  [getSettings, getDataType, getNonGlobalIndicator],
  (settings, type, indicators) => {
    if (!settings) return '';
    const { extentYear, threshold } = settings;

    const indicatorStatements =
      indicators &&
      indicators.map(
        i =>
          (i
            ? translateText(
              '*{indicator} are available in {datasetsCount} countries only',
              {
                indicator: i.label.toLowerCase(),
                datasetsCount: i.count
              }
            )
            : null)
      );

    const statements = compact([
      extentYear
        ? translateText('{extentYear} tree cover extent', { extentYear })
        : null,
      threshold || threshold === 0
        ? translateText('>{threshold}% tree canopy', { threshold })
        : null,
      type === 'loss'
        ? translateText(
          'these estimates do not take tree cover gain into account'
        )
        : null,
      ...(indicatorStatements || [])
    ]);

    return statements;
  }
);

export const getWidgetFooterProps = () =>
  createStructuredSelector({
    statements: getStatements,
    showAttributionLink: getIsTrase
  });
