import { createStructuredSelector, createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';

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

export const getRangeOptions = createSelector(
  [getPlanetBasemaps],
  (planetBasemaps) => {
    if (isEmpty(planetBasemaps)) return null;
    const groupByRange = groupBy(planetBasemaps, 'range');

    return Object.keys(groupByRange).map((y) => ({
      label: y,
      value: groupByRange?.[y]?.[0]?.name,
      range: y,
    }));
  }
);

export const getRangeSelected = createSelector(
  [getPlanetBasemaps, getRangeOptions, selectBasemapSelected],
  (basemaps, rangeOptions, selected) => {
    if (isEmpty(basemaps)) return null;
    const basemapSelected = basemaps.find(({ name }) => name === selected);

    return rangeOptions?.find((r) => r.range === basemapSelected?.range);
  }
);

export const getPeriodOptions = createSelector(
  [getPlanetBasemaps, getRangeSelected],
  (planetBasemaps, rangeSelected) => {
    if (isEmpty(planetBasemaps)) return null;
    const filteredBasemapsByRange = planetBasemaps.filter(
      (b) => b.range === rangeSelected?.range
    );

    return filteredBasemapsByRange?.map(({ period, name } = {}) => ({
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

export const getColorOptions = createSelector([], () => COLOR_OPTIONS);

export const getColorSelected = createSelector(
  [getColorOptions, selectBasemapColorSelected],
  (options, selected) => options.find((o) => o.value === selected)?.value
);

export default createStructuredSelector({
  rangeOptions: getRangeOptions,
  rangeSelected: getRangeSelected,
  periodOptions: getPeriodOptions,
  periodSelected: getPeriodSelected,
  colorOptions: getColorOptions,
  colorSelected: getColorSelected,
});
