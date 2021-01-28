import { createStructuredSelector, createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import { getPlanetBasemaps } from '../selectors';

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

const selectBasemapSelected = (state) => state?.map?.settings?.basemap?.name;
const selectBasemapColorSelected = (state) =>
  state?.map?.settings?.basemap?.color;

const getPeriodsByImageType = (basemaps, basemapImageType) => {
  const imageType = basemapImageType === 'rgb' ? 'visual' : 'analytic';
  return basemaps.filter((b) => b.value.includes(imageType));
};

export const getPeriodOptions = createSelector(
  [getPlanetBasemaps, selectBasemapColorSelected],
  (planetBasemaps, basemapImageType) => {
    if (isEmpty(planetBasemaps)) return null;
    const serialize = planetBasemaps?.map(({ period, name } = {}) => ({
      label: period,
      value: name,
    }));
    return serialize ? getPeriodsByImageType(serialize, basemapImageType) : [];
  }
);

export const getPeriodSelected = createSelector(
  [getPeriodOptions, selectBasemapSelected],
  (periodOptions, selected) => {
    if (isEmpty(periodOptions)) return null;
    return periodOptions?.find((r) => r.value === selected);
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
