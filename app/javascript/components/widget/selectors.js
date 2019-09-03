import { createStructuredSelector, createSelector } from 'reselect';

const selectProps = state => state;
const selectDataSettings = state => state.data && state.data.settings;
const selectDataOptions = state => state.data && state.data.options;
const selectSettings = state => state.settings;
const selectSettingsConfig = state => state.settingsConfig;
const selectTitle = state => state.title;
const selectLocationName = state => state.locationLabelFull;
const selectLocation = state => state.location;
const selectPolynames = state => state.polynames;

export const getWidgetSettings = createSelector(
  [selectSettings, selectDataSettings],
  (settings, dataSettings) => ({
    ...dataSettings,
    ...settings
  })
);

export const getTitle = createSelector(
  [selectTitle, selectLocationName],
  (title, locationLabelFull) =>
    title && title.replace('{location}', locationLabelFull || '...')
);

export const getOptions = createSelector(
  [
    getWidgetSettings,
    selectSettingsConfig,
    selectDataOptions,
    selectLocation,
    selectPolynames
  ],
  (settings, settingsConfig, dataOptions, location, polynames) =>
    settingsConfig &&
    settingsConfig.map(o => {
      const { key, startKey, endKey, options, whitelist } = o || {};
      const mergedOptions = (dataOptions && dataOptions[key]) || options || [];
      const parsedOptions =
        typeof mergedOptions === 'function'
          ? mergedOptions({ settings, ...location, polynames })
          : mergedOptions;

      return {
        ...o,
        ...(parsedOptions && {
          options: parsedOptions.filter(
            opt => !whitelist || whitelist.includes(opt.value)
          ),
          value: parsedOptions.find(opt => opt.value === settings[key]),
          ...(startKey && {
            startOptions: parsedOptions.filter(
              opt => opt.value <= settings[endKey]
            ),
            startValue: parsedOptions.find(
              opt => opt.value === settings[startKey]
            )
          }),
          ...(endKey && {
            endOptions: parsedOptions.filter(
              opt => opt.value >= settings[startKey]
            ),
            endValue: parsedOptions.find(opt => opt.value === settings[endKey])
          })
        })
      };
    })
);

export const getOptionsSelected = createSelector(
  [getOptions],
  options =>
    options &&
    options.reduce(
      (obj, option) => ({
        ...obj,
        [option.key]: option.options.find(o => o === option.value)
      }),
      {}
    )
);

export const getForestType = createSelector(
  getOptionsSelected,
  optionsSelected => optionsSelected && optionsSelected.forestType
);

export const getLandCategory = createSelector(
  getOptionsSelected,
  optionsSelected => optionsSelected && optionsSelected.landCategory
);

export const getIndicator = createSelector(
  [getForestType, getLandCategory],
  (forestType, landCategory) => {
    if (!forestType && !landCategory) return null;
    let label = '';
    let value = '';
    if (forestType && landCategory) {
      label = `${forestType.label} in ${landCategory.label}`;
      value = `${forestType.value}__${landCategory.value}`;
    } else if (landCategory) {
      label = landCategory.label;
      value = landCategory.value;
    } else {
      label = forestType.label;
      value = forestType.value;
    }

    return {
      label,
      value
    };
  }
);

export const getParsedProps = createSelector(
  [selectProps, getWidgetSettings, getIndicator],
  (props, settings, indicator) => ({
    ...(props.getWidgetProps &&
      props.getWidgetProps({ ...props, settings, indicator }))
  })
);

export const getWidgetProps = () =>
  createStructuredSelector({
    parsedProps: getParsedProps,
    options: getOptions,
    title: getTitle,
    settings: getWidgetSettings,
    optionsSelected: getOptionsSelected,
    indicator: getIndicator
  });
