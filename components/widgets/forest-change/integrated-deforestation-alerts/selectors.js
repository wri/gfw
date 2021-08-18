/* eslint-disable prefer-destructuring */
import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { formatNumber } from 'utils/format';

import moment from 'moment';

// get list data
const selectAlerts = (state) => state.data && state.data.alerts;
const selectColors = (state) => state.colors;
const selectSentences = (state) => state.sentence;
const getIndicator = (state) => state.indicator || null;
const getSettings = (state) => state.settings || null;
const getLocationName = (state) => state.locationLabel;

export const parseData = createSelector([selectAlerts], (data) => {
  if (!data || isEmpty(data)) return null;
  // Get counts from each confidence category ['high', 'highest', 'nominal']
  const highAlertsData = data.filter((d) => d.confidence === 'high');
  const highestAlertsData = data.filter((d) => d.confidence === 'highest');
  const lowAlertsData = data.filter((d) => d.confidence === 'nominal');

  // Extract alert count from alerts key (default to 0 if not found)
  const highAlerts = highAlertsData.length ? highAlertsData[0].alerts : 0;
  const highestAlerts = highestAlertsData.length
    ? highestAlertsData[0].alerts
    : 0;
  const lowAlerts = lowAlertsData.length ? lowAlertsData[0].alerts : 0;

  // Total alerts
  const totalAlerts = highAlerts + highestAlerts + lowAlerts;

  // Return parsed data structure including percentage
  return {
    totalAlertCount: totalAlerts,
    highAlertCount: highAlerts,
    highestAlertCount: highestAlerts,
    lowAlertCount: lowAlerts,
    highAlertPercentage: (100 * highAlerts) / totalAlerts,
    highestAlertPercentage: (100 * highestAlerts) / totalAlerts,
    lowAlertPercentage: (100 * lowAlerts) / totalAlerts,
  };
});

export const parseConfig = createSelector(
  [parseData, selectColors, getIndicator],
  (data, colors, indicator) => {
    if (isEmpty(data)) return null;

    const {
      highAlertCount,
      highestAlertCount,
      lowAlertCount,
      highAlertPercentage,
      highestAlertPercentage,
      lowAlertPercentage,
    } = data;
    const lowAlertsLabel = indicator
      ? `Detection from one alert system in ${indicator.label}`
      : 'Detection from one alert system';

    const highAlertsLabel = indicator
      ? `Detection from one alert system (with high-confidence) in ${indicator.label}`
      : 'Detection from one alert system (with high-confidence)';

    const highestAlertsLabel = indicator
      ? `Detection from multiple alert systems in ${indicator.label}`
      : 'Detection from multiple alert systems';

    const highColour = colors.integratedHigh;
    const highestColour = colors.integratedHighest;
    const lowColour = colors.integratedLow;
    const parsedData = [
      {
        label: highestAlertsLabel,
        value: highestAlertCount,
        color: highestColour,
        percentage: highestAlertPercentage,
        unit: 'counts',
      },
      {
        label: highAlertsLabel,
        value: highAlertCount,
        color: highColour,
        percentage: highAlertPercentage,
        unit: 'counts',
      },
      {
        label: lowAlertsLabel,
        value: lowAlertCount,
        color: lowColour,
        percentage: lowAlertPercentage,
        unit: 'counts',
      },
    ];
    return parsedData;
  }
);

export const parseSentence = createSelector(
  [parseData, getSettings, selectSentences, getIndicator, getLocationName],
  (data, settings, sentences, indicator, location) => {
    if (!data || isEmpty(data)) return null;

    const {
      totalAlertCount,
      highAlertPercentage,
      highestAlertPercentage,
    } = data;
    const startDate = settings.startDate;
    const endDate = settings.endDate;
    const formattedStartDate = moment(startDate).format('Do of MMMM YYYY');
    const formattedEndDate = moment(endDate).format('Do of MMMM YYYY');
    const params = {
      indicator: indicator && indicator.label,
      total: formatNumber({ num: totalAlertCount, unit: ',' }),
      highConfPerc:
        highAlertPercentage === 0
          ? 'none'
          : `${formatNumber({ num: highAlertPercentage, unit: '%' })}`,
      highestConfPerc:
        highestAlertPercentage === 0
          ? 'none'
          : `${formatNumber({ num: highestAlertPercentage, unit: '%' })}`,
      location,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      component: {
        key: 'individual alerts',
        fine: true,
        tooltip:
          'An individual alert may include one or more detections made by any of the the GLAD-Landsat, GLAD-S2, or RADD alert systems. While each individual system may have high or low confidence in a detection, agreement between systems is considered to represent overall confidence.',
      },
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
