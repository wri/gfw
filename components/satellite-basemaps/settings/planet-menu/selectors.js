import { createStructuredSelector, createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import { getPlanetBasemaps } from '../../planet-selectors';

const COLOR_OPTIONS = [
  {
    label: 'Natural color',
    value: 'rgb',
  },
  {
    label: 'False color (NIR)',
    value: 'cir',
  },
];

const selectBasemapSelected = (state) => {
  return state?.map?.settings?.basemap?.name;
};
const selectBasemapColorSelected = (state) =>
  state?.map?.settings?.basemap?.color;

export const getPeriodOptions = createSelector(
  [getPlanetBasemaps],
  (planetBasemaps) => {
    if (isEmpty(planetBasemaps)) return null;
    return planetBasemaps
      ?.map(({ label, period, name, year } = {}) => ({
        label,
        period,
        year,
        value: name,
      }))
      .reverse();
  }
);

export const getPeriodSelected = createSelector(
  [getPeriodOptions, selectBasemapSelected],
  (periodOptions, selected) => {
    if (isEmpty(periodOptions)) return null;
    const period = periodOptions?.find((r) => r.value === selected);
    if (!period) return periodOptions[0];
    return period;
  }
);

export const getPeriodSelectedIndex = createSelector(
  [getPeriodOptions, selectBasemapSelected],
  (periodOptions, selected) => {
    if (isEmpty(periodOptions)) return null;
    const periodIndex = periodOptions?.findIndex((r) => r.value === selected);
    if (periodIndex === -1) {
      return 0;
    }
    return periodIndex;
  }
);

export const getColorOptions = createSelector([], () => COLOR_OPTIONS);

export const getColorSelected = createSelector(
  [getColorOptions, selectBasemapColorSelected],
  (options, selected) => options.find((o) => o.value === selected)?.value
);

export default createStructuredSelector({
  periodOptions: getPeriodOptions,
  periodSelected: getPeriodSelected,
  periodSelectedIndex: getPeriodSelectedIndex,
  colorOptions: getColorOptions,
  colorSelected: getColorSelected,
});
