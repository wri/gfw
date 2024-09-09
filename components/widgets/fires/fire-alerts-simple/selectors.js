/* eslint-disable prefer-destructuring */
import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { formatNumber } from 'utils/format';
import { translateText } from 'utils/lang';
import { localizeWidgetSentenceDate } from 'utils/localize-date';

// get list data
const selectAlerts = (state) => state.data && state.data.alerts;
const selectColors = (state) => state.colors;
const selectSentences = (state) => state.sentence;
const getIndicator = (state) => state.indicator || null;
const getSettings = (state) => state.settings || null;
const getLocationName = (state) => state.locationLabel;
const getDataset = (state) => state.settings.dataset || null;
const getLanguage = (state) => state.lang;

export const parseData = createSelector([selectAlerts], (data) => {
  if (isEmpty(data)) return null;
  const otherAlertsData = data.filter((d) => d.confirmed === false);
  const confimedAlertsData = data.filter((d) => d.confirmed === true);

  let otherAlerts = 0;

  if (otherAlertsData.length) {
    otherAlertsData.forEach((otherAlert) => {
      otherAlerts += otherAlert.alerts;
    });
  }

  const highConfidenceAlerts = confimedAlertsData.length
    ? confimedAlertsData[0].alerts
    : 0;

  const totalAlerts = otherAlerts + highConfidenceAlerts;

  return {
    totalAlertCount: totalAlerts,
    otherAlertCount: otherAlerts,
    otherAlertPercentage: (100 * otherAlerts) / totalAlerts,
    highConfidenceAlertCount: highConfidenceAlerts,
    highConfidenceAlertPercentage: (100 * highConfidenceAlerts) / totalAlerts,
  };
});

export const parseConfig = createSelector(
  [parseData, selectColors, getIndicator],
  (data, colors, indicator) => {
    if (isEmpty(data)) return null;
    const {
      otherAlertCount,
      otherAlertPercentage,
      highConfidenceAlertCount,
      highConfidenceAlertPercentage,
    } = data;
    const alertsLabel = indicator
      ? translateText('Other alerts in {indicatorLabel}', {
          indicatorLabel: indicator.label,
        })
      : translateText('Other alerts');
    const highConfidenceAlertsLabel = indicator
      ? translateText('High confidence alerts in {indicatorLabel}', {
          indicatorLabel: indicator.label,
        })
      : translateText('High confidence alerts');

    const highConfidenceColour = colors.main;
    const otherColour = colors.otherColor; // hslShift(mainColour)
    const parsedData = [
      {
        label: highConfidenceAlertsLabel,
        value: highConfidenceAlertCount,
        color: highConfidenceColour,
        percentage: highConfidenceAlertPercentage,
        unit: 'counts',
      },
      {
        label: alertsLabel,
        value: otherAlertCount,
        color: otherColour,
        percentage: otherAlertPercentage,
        unit: 'counts',
      },
    ];
    return parsedData;
  }
);

export const parseSentence = createSelector(
  [
    parseData,
    getDataset,
    getSettings,
    selectSentences,
    getIndicator,
    getLocationName,
    getLanguage,
  ],
  (data, dataset, settings, sentences, indicator, location, language) => {
    if (!data) return null;
    const startDate = settings.startDate;
    const endDate = settings.endDate;
    const formattedStartDate = localizeWidgetSentenceDate(startDate, language);
    const formattedEndDate = localizeWidgetSentenceDate(endDate, language);
    const params = {
      indicator: indicator && indicator.label,
      location,
      dataset: dataset.toUpperCase(),
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      component: {
        key: 'high confidence alerts',
        fine: false,
        tooltip:
          'Fire alerts become "high confidence" when loss is detected in multiple Landsat images. Only a small percentage of recent alerts will be "high confidence" because it can take weeks or even months for another cloud free image.',
      },
      count: formatNumber({ num: data.totalAlertCount, unit: ',' }),
      highConfidencePercentage:
        data.highConfidenceAlertCount === 0
          ? 'none'
          : formatNumber({
              num: data.highConfidenceAlertPercentage,
              unit: '%',
            }),
    };
    return {
      sentence: indicator ? sentences.withInd : sentences.default,
      params,
    };
  }
);

export default createStructuredSelector({
  data: parseConfig,
  sentence: parseSentence,
});
