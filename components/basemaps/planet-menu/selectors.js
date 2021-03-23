import { createStructuredSelector, createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import { getPlanetBasemaps } from '../selectors';

const selectBasemapSelected = (state) => state?.map?.settings?.basemap?.name;
const selectBasemapColorSelected = (state) =>
  state?.map?.settings?.basemap?.color;

const getBasemapOptions = (state) => state?.planet?.options;

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
    return periodOptions?.find((r) => r.value === selected);
  }
);

export const getColorOptions = createSelector(
  [getBasemapOptions],
  (options) => {
    if (!options) return null;
    try {
      return Object.values(options);
    } catch (_) {
      return null;
    }
  }
);

export const getColorSelected = createSelector(
  [getColorOptions, selectBasemapColorSelected],
  (options, selected) => {
    if (!options) return null;
    if (selected === 'cir') {
      return options.find((opt) => opt.id === 'analytical').value;
    }
    return options.find((opt) => opt.id === 'visual').value;
  }
);

export default createStructuredSelector({
  periodOptions: getPeriodOptions,
  periodSelected: getPeriodSelected,
  colorOptions: getColorOptions,
  colorSelected: getColorSelected,
});
