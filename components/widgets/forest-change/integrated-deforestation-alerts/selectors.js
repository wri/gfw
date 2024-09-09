/* eslint-disable prefer-destructuring */
import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import filter from 'lodash/filter';
import { formatNumber } from 'utils/format';
import { translateText } from 'utils/lang';
import { localizeWidgetSentenceDate } from 'utils/localize-date';

import moment from 'moment';

// get list data
const selectAlerts = (state) => state.data && state.data.alerts;
const selectColors = (state) => state.colors;
const selectSentences = (state) => state.sentence;
const getIndicator = (state) => state.indicator || null;
const getSettings = (state) => state.settings || null;
const getLocationName = (state) => state.locationLabel;
const getOptionsSelected = (state) => state.optionsSelected;
const getLanguage = (state) => state.lang;

export const parseData = createSelector([selectAlerts], (data) => {
  if (!data || isEmpty(data)) return null;

  const confidence = data?.confidence || false;
  if (data?.otf) {
    return {
      confidence,
      alertSystem: data?.alertSystem || 'all',
      totalAlertCount: data?.sum || 0,
      highAlertCount: data?.highCount || 0,
      highestAlertCount: data?.highestCount || 0,
      totalArea: data?.totalArea || 0,
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
  let totalAlerts;
  let totalArea;

  if (!confidence) {
    totalAlerts = highAlerts + highestAlerts + lowAlerts;
    totalArea = sumBy(data.allAlerts, 'alert_area__ha');
  } else {
    totalAlerts = highAlerts + highestAlerts;
    totalArea = sumBy(
      filter(
        data.allAlerts,
        (f) => f.confidence === 'high' || f.confidence === 'highest'
      ),
      'alert_area__ha'
    );
  }

  // Return parsed data structure including percentage
  return {
    confidence,
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
      confidence,
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
      ...(!confidence
        ? [
            {
              label: alertSystem === 'all' ? lowAlertsLabel : 'Other alerts',
              value: lowAlertCount,
              color: lowColour,
              percentage: lowAlertPercentage,
              unit: 'counts',
            },
          ]
        : []),
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
    getLanguage,
  ],
  (data, settings, sentences, indicator, currentLabel, options, language) => {
    if (!data || isEmpty(data)) return null;
    // TODO explore why the getOptionsSelected is returning null

    const {
      alertSystem = 'all',
      confidence,
      totalArea,
      totalAlertCount,
      highAlertPercentage,
      highestAlertPercentage,
    } = data;

    const { deforestationAlertsDataset = { label: null, value: null } } =
      options;
    const { label: system, value: systemSlug } = deforestationAlertsDataset;

    const selectedDate = settings.startDate;
    const endDate = settings.endDate;

    const possibleStartDate =
      alertSystem === 'glad_l' ? '2021-01-01' : '2019-01-01';
    const possibleStartDateMoment = moment(possibleStartDate);
    const startDateMoment = moment(selectedDate);
    const diff = possibleStartDateMoment.diff(startDateMoment, 'days');
    const startDate = diff > 0 ? possibleStartDate : selectedDate;

    const formattedStartDate = localizeWidgetSentenceDate(startDate, language);
    const formattedEndDate = localizeWidgetSentenceDate(endDate, language);

    const params = {
      location: currentLabel === 'global' ? 'globally' : currentLabel,
      indicator: indicator && indicator.label,
      system,
      totalArea: !totalArea
        ? ' '
        : translateText('covering a total of {area}', {
          area: formatNumber({
            num: totalArea,
            unit: 'ha',
            spaceUnit: true,
          })}),
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

    const {
      initial,
      withInd,
      singleSystem,
      singleSystemWithInd,
      highConf,
      noReportedAlerts,
    } = sentences;
    let sentence = indicator ? withInd : initial;

    if (indicator && systemSlug !== 'all') {
      sentence = indicator ? singleSystemWithInd : singleSystem;
    }

    // Take alert system into account
    if (!indicator) {
      sentence = alertSystem === 'all' ? initial : singleSystem;
    }

    if (confidence) {
      sentence = highConf;
    }

    if (totalAlertCount === 0) {
      sentence = noReportedAlerts;
    }

    return {
      sentence,
      params: {
        // TODO: put back systemSlug === 'all' &&
        // alertSystem === 'radd,glad_l,glad_s2'
        ...params,
        ...(alertSystem === 'all' && {
          system: ' ',
        }),
        ...(alertSystem === 'radd' && {
          system: 'RADD',
        }),
        ...(alertSystem === 'glad_l' && {
          system: 'GLAD-L',
        }),
        ...(alertSystem === 'glad_s2' && {
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
