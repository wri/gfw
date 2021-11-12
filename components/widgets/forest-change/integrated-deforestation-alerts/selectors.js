/* eslint-disable prefer-destructuring */
import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import { formatNumber } from 'utils/format';

import moment from 'moment';

// get list data
const selectAlerts = (state) => state.data && state.data.alerts;
const selectColors = (state) => state.colors;
const selectSentences = (state) => state.sentence;
const getIndicator = (state) => state.indicator || null;
const getSettings = (state) => state.settings || null;
const getLocationName = (state) => state.locationLabel;
const getOptionsSelected = (state) => state.optionsSelected;

export const parseData = createSelector([selectAlerts], (data) => {
  if (!data || isEmpty(data)) return null;

  if (data?.otf) {
    return {
      alertSystem: data?.alertSystem || 'all',
      totalAlertCount: data?.sum || 0,
      highAlertCount: data?.highCount || 0,
      highestAlertCount: data?.highestCount || 0,
      lowAlertCount: data?.nominalCount || 0,
      highAlertPercentage: (100 * (data?.highCount || 0)) / data?.sum || 0,
      highestAlertPercentage:
        (100 * (data?.highestCount || 0)) / data?.sum || 0,
      lowAlertPercentage: (100 * (data?.nominalCount || 0)) / data?.sum || 0,
    };
  }

  // Get counts from each confidence category ['high', 'highest', 'nominal']
  const highAlertsData = data.allAlerts.filter((d) => d.confidence === 'high');
  const highestAlertsData = data.allAlerts.filter(
    (d) => d.confidence === 'highest'
  );
  const lowAlertsData = data.allAlerts.filter((d) =>
    ['nominal', 'low'].includes(d.confidence)
  );

  // Extract alert count from alerts key (default to 0 if not found)
  const highAlerts = highAlertsData.length ? highAlertsData[0].alerts : 0;
  const highestAlerts = highestAlertsData.length
    ? highestAlertsData[0].alerts
    : 0;
  const lowAlerts = lowAlertsData.length ? lowAlertsData[0].alerts : 0;

  // Total alerts
  const totalAlerts = highAlerts + highestAlerts + lowAlerts;

  const totalArea = sumBy(data.allAlerts, 'alert_area__ha');

  // Return parsed data structure including percentage
  return {
    alertSystem: data?.alertSystem || 'all',
    totalArea,
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
  [parseData, selectColors, getIndicator, getSettings],
  (data, colors, indicator) => {
    if (isEmpty(data)) return null;
    const {
      alertSystem = 'all',
      highAlertCount,
      highestAlertCount,
      lowAlertCount,
      highAlertPercentage,
      highestAlertPercentage,
      lowAlertPercentage,
    } = data;

    const lowAlertsLabel = indicator
      ? `Detection by a single alert system in ${indicator.label}`
      : 'Detection by a single alert system';

    const highAlertsLabel = indicator
      ? `High confidence detection by a single alert system in ${indicator.label}`
      : 'High confidence detection by a single alert system';

    const highestAlertsLabel = indicator
      ? `Highest confidence detection by multiple alert systems in ${indicator.label}`
      : 'Highest confidence detection by multiple alert systems';

    const highColour = colors.integratedHigh;
    const highestColour = colors.integratedHighest;
    const lowColour = colors.integratedLow;
    const parsedData = [
      ...(alertSystem === 'all'
        ? [
            {
              label: highestAlertsLabel,
              value: highestAlertCount,
              color: highestColour,
              percentage: highestAlertPercentage,
              unit: 'counts',
            },
          ]
        : []),
      {
        label:
          alertSystem === 'all' ? highAlertsLabel : 'High confidence alerts',
        value: highAlertCount,
        color: highColour,
        percentage: highAlertPercentage,
        unit: 'counts',
      },
      {
        label: alertSystem === 'all' ? lowAlertsLabel : 'Other alerts',
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
  [
    parseData,
    getSettings,
    selectSentences,
    getIndicator,
    getLocationName,
    getOptionsSelected,
  ],
  (data, settings, sentences, indicator, currentLabel, options) => {
    if (!data || isEmpty(data)) return null;

    const {
      alertSystem = 'all',
      totalArea,
      totalAlertCount,
      highAlertPercentage,
      highestAlertPercentage,
    } = data;

    const { deforestationAlertsDataset } = options;
    const { label: system, value: systemSlug } = deforestationAlertsDataset;
    const startDate = settings.startDate;
    const endDate = settings.endDate;
    const formattedStartDate = moment(startDate).format('Do of MMMM YYYY');
    const formattedEndDate = moment(endDate).format('Do of MMMM YYYY');

    const params = {
      location: currentLabel === 'global' ? 'globally' : currentLabel,
      indicator: indicator && indicator.label,
      system,
      totalArea: !totalArea
        ? ' '
        : `covering a total of ${formatNumber({ num: totalArea, unit: 'ha' })}`,
      total: formatNumber({ num: totalAlertCount, unit: ',' }),
      highConfPerc:
        highAlertPercentage === 0
          ? 'none'
          : `${formatNumber({ num: highAlertPercentage, unit: '%' })}`,
      highestConfPerc:
        highestAlertPercentage === 0
          ? 'none'
          : `${formatNumber({ num: highestAlertPercentage, unit: '%' })}`,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      ...((systemSlug === 'glad_l' && {
        component: {
          key: 'high confidence alerts',
          fine: true,
          tooltip:
            'Alerts are classified as high confidence when a second satellite pass has also identified the pixel as an alert. Most of the alerts that remain unclassified have not had another satelite pass, due to the 8-day revisit time or cloud cover.',
        },
      }) ||
        (systemSlug === 'glad_s2' && {
          component: {
            key: 'high confidence alerts',
            fine: true,
            tooltip:
              'Alerts are classified as high confidence when at least two or four subsequent observations are labeled as forest loss.',
          },
        }) ||
        (systemSlug === 'radd' && {
          component: {
            key: 'high confidence alerts',
            fine: true,
            tooltip:
              'Alerts are marked as high confidence when they reach a probability threshold of 97.5% across multiple images in a 90-day window.',
          },
        })),
    };

    const { initial, withInd, singleSystem, singleSystemWithInd } = sentences;
    let sentence = indicator ? withInd : initial;

    if (indicator && systemSlug !== 'all') {
      sentence = indicator ? singleSystemWithInd : singleSystem;
    }

    // Take alert system into account
    if (!indicator) {
      sentence = alertSystem === 'all' ? initial : singleSystem;
    }

    return {
      sentence,
      params: {
        ...params,
        ...(system === 'All alerts' &&
          alertSystem === 'radd' && {
            system: 'RADD',
          }),
        ...(system === 'All alerts' &&
          alertSystem === 'glad_l' && {
            system: 'GLAD-L',
          }),
        ...(system === 'All alerts' &&
          alertSystem === 'glad_s' && {
            system: 'GLAD-S2',
          }),
        highConfidenceAlerts: 'high confidence alerts',
      },
    };
  }
);

export default createStructuredSelector({
  data: parseConfig,
  sentence: parseSentence,
});
