import { createStructuredSelector, createSelector } from 'reselect';

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

const selectBasemapColorSelected = (state) =>
  state?.map?.settings?.basemap?.color;

export const getColorOptions = createSelector([], () => COLOR_OPTIONS);

export const getColorSelected = createSelector(
  [getColorOptions, selectBasemapColorSelected],
  (options, selected) => {
    return options.find((o) => o.value === selected)?.value;
  }
);

export default createStructuredSelector({
  colorOptions: getColorOptions,
  colorSelected: getColorSelected,
});
