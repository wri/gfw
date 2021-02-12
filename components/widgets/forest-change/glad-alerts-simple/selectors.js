/* eslint-disable prefer-destructuring */
import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { formatNumber } from 'utils/format';
import moment from 'moment';


// get list data
const selectAlerts = (state) => state.data && state.data.alerts;
// const selectLatestDates = (state) => state.data && state.data.latest;
const selectColors = (state) => state.colors;
const selectSentences = (state) => state.sentence;
const getIndicator = (state) => state.indicator || null;

export const parseData = createSelector(
  [selectAlerts, getIndicator],
  (data, indicator, hasPlantations) => {
    if (isEmpty(data)) return null;
    console.log('hasPlantations', hasPlantations)
    console.log('indicator', indicator)
    console.log('data', data)
    
    const unconfirmedAlertsData = data.filter(d => d.confirmed === false);
    const confimedAlertsData = data.filter(d => d.confirmed === true);

    const unconfirmedAlerts = unconfirmedAlertsData.length ? unconfirmedAlertsData[0].alerts : 0;
    const confirmedAlerts = confimedAlertsData.length ? confimedAlertsData[0].alerts : 0;

    const totalAlerts = unconfirmedAlerts + confirmedAlerts;

    return {
      totalAlertCount: totalAlerts,
      unconfirmedAlertCount: unconfirmedAlerts,
      unconfirmedAlertPercentage: 100 * unconfirmedAlerts / totalAlerts,
      confirmedAlertCount: confirmedAlerts,
      confirmedAlertPercentage: 100 * confirmedAlerts / totalAlerts,
    };
  }
);

export const parseConfig = createSelector(
  [parseData, selectColors, getIndicator],
  (data, colors, indicator, hasPlantations) => {
    if (isEmpty(data)) return null;
    // const label = indicator ? ` in ${indicator.label}` : '';
    const parsedData = [
      {
        label: 'Alerts',
        value: data.unconfirmedAlertCount,
        color: colors.main,
        percentage: data.unconfirmedAlertPercentage,
        unit: ' '
      },
      {
        label: 'Confirmed Alerts',
        value: data.confirmedAlertCount,
        color: colors.gladConfirmed,
        percentage: data.confirmedAlertPercentage.totalAlertCount,
        unit: ' '
      }
    ];
    // if (indicator) {
    //   parsedData.splice(1, 0, {
    //     label: hasPlantations ? 'Other forest cover' : 'Other tree cover',
    //     value: otherCover,
    //     color: colors.otherCover,
    //     percentage: otherCover / totalArea * 100
    //   });
    // } else if (!indicator && hasPlantations) {
    //   parsedData.splice(1, 0, {
    //     label: 'Plantations',
    //     value: plantations,
    //     color: colors.plantedForest,
    //     percentage: plantations / totalArea * 100
    //   });
    // }
    return parsedData;
  }
);

export const parseSentence = createSelector(
  [
    parseData,
    selectSentences,
    getIndicator
  ],
  (data, sentences, indicator) => {
    if (!data) return null;
    const startDate = '2021-01-01'
    const endDate = '2021-01-20'

    const formattedStartDate = moment(startDate).format('Do of MMMM YYYY');
    const formattedEndDate = moment(endDate).format('Do of MMMM YYYY');
    const params = {
      indicator: indicator && indicator.label,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      count: formatNumber({num: data.totalAlertCount, unit: 'count'}), 
      confirmedPercentage: formatNumber({num:data.confirmedAlertPercentage, unit: '%'})
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
