import { createStructuredSelector, createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import { getPlanetBasemaps } from 'components/basemaps/selectors';

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

const selectBasemapSelected = (state) => state?.map?.settings?.basemap?.label;
const selectBasemapColorSelected = (state) =>
  state?.map?.settings?.basemap?.color;

export const getPeriodOptions = createSelector(
  [getPlanetBasemaps],
  (planetBasemaps) => {
    if (isEmpty(planetBasemaps)) return null;
    return planetBasemaps?.map(({ period, name } = {}) => ({
      label: period,
      value: name,
    }));
  }
);

export const getPeriodSelected = createSelector(
  [getPeriodOptions, selectBasemapSelected],
  (periodOptions, selected) => {
    if (isEmpty(periodOptions)) return null;
    const index = periodOptions?.findIndex((r) => r.value === selected);
    if (index === -1) {
      return 0;
    }
    return index;
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
  colorOptions: getColorOptions,
  colorSelected: getColorSelected,
});
