import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import { pluralise } from 'utils/strings';

export const selectData = (state, { data }) => data;
export const selectOptions = (state, { options }) => options;
export const selectSettings = (state, { settings }) => settings;
export const selectConfig = (state, { config }) => config;
export const selectLocation = (state, { location }) => location;
export const selectWhitelist = (state, { activeWhitelist }) => activeWhitelist;

// export const getForestType = createSelector(
//   [getOptionsSelected],
//   options => options.forestType
// );

// export const getLandCategory = createSelector(
//   [getOptionsSelected],
//   options => options.landCategory
// );

// export const getIndicator = createSelector(
//   [getForestType, getLandCategory],
//   (forestType, landCategory) => {
//     if (!forestType && !landCategory) return null;
//     let label = '';
//     let value = '';
//     if (forestType && landCategory) {
//       label = `${forestType.label} in ${landCategory.label}`;
//       value = `${forestType.value}__${landCategory.value}`;
//     } else if (landCategory) {
//       label = landCategory.label;
//       value = landCategory.value;
//     } else {
//       label = forestType.label;
//       value = forestType.value;
//     }

//     return {
//       label,
//       value
//     };
//   }
// );

// export const getRangeYears = createSelector(
//   [selectData, selectConfig],
//   (data, config) => {
//     if (isEmpty(data)) return null;
//     const yearsData =
//       data.loss ||
//       (data.lossByRegion &&
//         data.lossByRegion.length &&
//         data.lossByRegion[0].loss) ||
//       data;
//     if (isEmpty(yearsData) || !Array.isArray(yearsData)) return null;
//     return uniq(yearsData.map(d => d.year))
//       .filter(
//         d =>
//           !config.yearRange ||
//           (d >= config.yearRange[0] && d <= config.yearRange[1])
//       )
//       .map(d => ({
//         label: d,
//         value: d
//       }));
//   }
// );

// export const getStartYears = createSelector(
//   [getRangeYears, selectSettings],
//   (years, settings) => {
//     if (isEmpty(years)) return null;
//     const { endYear } = settings;
//     return years.filter(y => y.value <= endYear);
//   }
// );

// export const getEndYears = createSelector(
//   [getRangeYears, selectSettings],
//   (years, settings) => {
//     if (isEmpty(years)) return null;
//     const { startYear } = settings;
//     return years.filter(y => y.value >= startYear);
//   }
// );

// export const getWidgetProps = createStructuredSelector({
//   indicator: getIndicator,
//   forestType: getForestType,
//   landCategory: getLandCategory
// });
