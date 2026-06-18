import { createStructuredSelector, createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import { getPlanetBasemaps } from '../../planet-selectors';

const COLOR_OPTIONS = [
  {
    label: 'Natural color',
    imageType: 'visual',
    value: '',
  },
  {
    label: 'False color (NIR)',
    imageType: 'analytic',
    value: 'cir',
  },
];

const selectBasemapSelected = (state) => {
  return state?.map?.settings?.basemap?.name;
};
const selectBasemapColorSelected = (state) =>
  state?.map?.settings?.basemap?.color;

const selectBasemapImageTypeSelected = (state) =>
  state?.map?.settings?.basemap?.color === '' ? 'visual' : 'analytic';

const serializePlanetTile = ({
  label,
  period,
  name,
  imageType,
  sortOrder,
  year,
  proc,
} = {}) => ({
  label,
  period,
  year,
  imageType,
  sortOrder,
  proc,
  value: name,
});

// Returns the opposite default option, used when switching image types
const getDefaultPeriodOption = createSelector(
  [selectBasemapImageTypeSelected, getPlanetBasemaps],
  (selected, planetBasemaps) => {
    if (isEmpty(planetBasemaps)) return null;
    const oppositeImage = selected === 'visual' ? 'analytic' : 'visual';
    const periodOptions = planetBasemaps
      .map((tile) => serializePlanetTile(tile))
      .filter((bm) => bm.imageType === oppositeImage);
    return periodOptions[0];
  }
);

export const getPeriodOptions = createSelector(
  [selectBasemapImageTypeSelected, getPlanetBasemaps],
  (selected, planetBasemaps) => {
    if (isEmpty(planetBasemaps)) return null;
    const periodOptions = planetBasemaps
      ?.map((tile) => serializePlanetTile(tile))
      .filter((bm) => bm.imageType === selected)
      .reverse();
    return periodOptions;
  }
);

export const getPeriodSelected = createSelector(
  [selectBasemapSelected, getPeriodOptions],
  (selected, periodOptions) => {
    if (isEmpty(periodOptions)) return null;
    const period = periodOptions?.find((r) => r.value === selected);
    if (!period) return periodOptions[periodOptions.length - 1];
    return period;
  }
);

export const getPeriodSelectedIndex = createSelector(
  [getPeriodOptions, selectBasemapSelected],
  (periodOptions, selected) => {
    if (isEmpty(periodOptions)) return null;
    const periodIndex = periodOptions?.findIndex((r) => r.value === selected);
    if (periodIndex === -1) {
      return periodOptions.length - 1;
    }
    return periodIndex;
  }
);

export const getColorOptions = createSelector([], () => COLOR_OPTIONS);

export const getColorSelected = createSelector(
  [getColorOptions, selectBasemapColorSelected],
  (options, selected) => {
    return options.find((o) => o.value === selected)?.value;
  }
);

export default createStructuredSelector({
  periodOptions: getPeriodOptions,
  periodSelected: getPeriodSelected,
  periodSelectedIndex: getPeriodSelectedIndex,
  colorOptions: getColorOptions,
  colorSelected: getColorSelected,
  defaultPeriodOption: getDefaultPeriodOption,
});
