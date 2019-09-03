import { createStructuredSelector, createSelector } from 'reselect';

const selectProps = state => state;
const selectDataSettings = state => state.data && state.data.settings;
const selectDataOptions = state => state.data && state.data.options;
const selectSettings = state => state.settings;
const selectOptions = state => state.options;
const selectTitle = state => state.title;
const selectLocationName = state => state.locationLabelFull;

export const getWidgetSettings = createSelector(
  [selectSettings, selectDataSettings],
  (settings, dataSettings) => ({
    ...dataSettings,
    ...settings
  })
);

export const getParsedProps = createSelector(
  [selectProps, getWidgetSettings],
  (props, settings) => ({
    ...(props.getWidgetProps && props.getWidgetProps({ ...props, settings }))
  })
);

export const getTitle = createSelector(
  [selectTitle, selectLocationName],
  (title, locationLabelFull) =>
    title && title.replace('{location}', locationLabelFull || '...')
);

export const getOptions = createSelector(
  [getWidgetSettings, selectOptions, selectDataOptions],
  (settings, options, dataOptions) =>
    options &&
    options.map(o => {
      const { key, startKey, endKey, options: tempOptions, whitelist } =
        o || {};
      const allOptions = (dataOptions && dataOptions[key]) || tempOptions || [];
      const parsedOptions = allOptions;
      // typeof allOptions === 'function'
      //   ? allOptions(settings)
      //   : allOptions;

      return {
        ...o,
        options:
          parsedOptions &&
          parsedOptions.filter(
            opt => !whitelist || whitelist.includes(opt.value)
          ),
        value:
          parsedOptions &&
          parsedOptions.find(opt => opt.value === settings[key]),
        startOptions:
          parsedOptions &&
          parsedOptions.filter(opt => opt.value <= settings[endKey]),
        endOptions:
          parsedOptions &&
          parsedOptions.filter(opt => opt.value >= settings[startKey]),
        startValue:
          parsedOptions &&
          parsedOptions.find(opt => opt.value === settings[startKey]),
        endValue:
          parsedOptions &&
          parsedOptions.find(opt => opt.value === settings[endKey])
      };
    })
);

export const getWidgetProps = () =>
  createStructuredSelector({
    parsedProps: getParsedProps,
    options: getOptions,
    title: getTitle,
    settings: getWidgetSettings
  });
