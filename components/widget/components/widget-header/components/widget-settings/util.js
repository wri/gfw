/**
 * @param {Array} array
 * @param {String} key
 * @returns
 */
const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
};

/**
 * Check and render dist alerts options dynamically based on deforestationAlertsDataset value
 * TODO: update this function to support ALL options and not only deforestationAlertsDataset
 * to be more "generic"
 * @param {Object} settings - the actual config in the store
 * @param {Array} settingsConfig - settings configuration from the widget
 * @param {Array} deforestationAlertsDataset - collection of items from data folder
 * @returns {Array} filteredSettingsConfig
 */
export const filterSettingsConfigDynamically = (
  settings,
  settingsConfig,
  deforestationAlertsDataset
) => {
  const deforestationAlertsKeys = convertArrayToObject(
    deforestationAlertsDataset,
    'value'
  );
  const key = settings.deforestationAlertsDataset;
  const shouldRenderDistAlertOptions =
    deforestationAlertsKeys[key]?.enableDistAlertOption;
  const filteredSettingsConfig = [...settingsConfig];

  if (!shouldRenderDistAlertOptions) {
    const foundIndex = filteredSettingsConfig.findIndex(
      (item) => item.key === 'distAlertOptions'
    );
    delete filteredSettingsConfig[foundIndex];
  }

  return filteredSettingsConfig;
};
