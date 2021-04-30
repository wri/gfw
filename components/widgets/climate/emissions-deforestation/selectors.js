import { createSelector, createStructuredSelector } from 'reselect';
import { format } from 'd3-format';
import isEmpty from 'lodash/isEmpty';

import { formatNumber } from 'utils/format';
import {
  yearTicksFormatter,
  zeroFillYears,
} from 'components/widgets/utils/data';

// get list data
const getData = (state) => state.data && state.data.loss;
const getSettings = (state) => state.settings;
const getColors = (state) => state.colors;
const getIndicator = (state) => state.indicator;
const getLocationName = (state) => state.locationLabel;
const getSentences = (state) => state.sentences;

export const parseData = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (isEmpty(data)) return null;
    const { startYear, endYear, yearsRange, gasesIncluded } = settings;
    const years = yearsRange && yearsRange.map((yearObj) => yearObj.value);
    const fillObj = {
      area: 0,
      biomassLoss: 0,
      bound1: null,
      emissions: 0,
      percentage: 0,
    };
    const zeroFilledData = zeroFillYears(
      data,
      startYear,
      endYear,
      years,
      fillObj
    );
    return (
      zeroFilledData &&
      zeroFilledData
        .filter((d) => d.year >= startYear && d.year <= endYear)
        .map((d) => ({
          ...d,
          emissions: d[gasesIncluded],
        }))
    );
  }
);

export const parseConfig = createSelector(
  [getColors, getSettings],
  (colors, settings) => {
    const { loss } = colors;
    const { gasesIncluded } = settings;
    let emissionLabel = 'Emissions';
    if (gasesIncluded !== 'allGases') {
      emissionLabel +=
        gasesIncluded === 'co2Only' ? ' (CO\u2082)' : ' (non-CO\u2082)';
    }
    return {
      height: 250,
      xKey: 'year',
      yKeys: {
        bars: {
          emissions: {
            fill: loss.main,
            background: false,
          },
        },
      },
      xAxis: {
        tickFormatter: yearTicksFormatter,
      },
      tooltip: [
        {
          key: 'year',
        },
        {
          key: 'emissions',
          label: emissionLabel,
          unit: 't CO2e',
          unitFormat: (value) => format('.3s')(value),
          color: loss.main,
        },
      ],
      unit: 't CO2e',
      unitFormat: (value) => format('.2s')(value),
    };
  }
);

export const parseSentence = createSelector(
  [parseData, getSettings, getIndicator, getSentences, getLocationName],
  (data, settings, indicator, sentences, locationName) => {
    if (!data || isEmpty(data)) return null;
    const { initial, co2Only, nonCo2Only } = sentences;
    const { startYear, endYear, gasesIncluded } = settings;
    const totalBiomass = data
      .map((d) => d.emissions)
      .reduce((sum, d) => (d ? sum + d : sum));

    let indicatorText = '';
    if (indicator && indicator.value === 'mining') {
      indicatorText = ` ${indicator.label} regions`;
    } else if (indicator) {
      indicatorText = ` ${indicator.label}`;
    }

    let emissionString = '.';
    if (gasesIncluded !== 'allGases') {
      emissionString = gasesIncluded === 'co2Only' ? co2Only : nonCo2Only;
    }
    const sentence = initial + emissionString;

    const params = {
      value: `${formatNumber({ num: totalBiomass, unit: 't' })} of CO\u2082e`,
      location: locationName,
      annualAvg: formatNumber({ num: totalBiomass / data.length, unit: 't' }),
      startYear,
      endYear,
      indicatorText,
    };
    return { sentence, params };
  }
);

export default createStructuredSelector({
  data: parseData,
  config: parseConfig,
  sentence: parseSentence,
});
