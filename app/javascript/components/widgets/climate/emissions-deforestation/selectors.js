import { createSelector, createStructuredSelector } from 'reselect';
import { format } from 'd3-format';
import isEmpty from 'lodash/isEmpty';

import { formatNumber } from 'utils/format';
import {
  yearTicksFormatter,
  zeroFillYears
} from 'components/widgets/utils/data';

// get list data
const getData = state => state.data && state.data.loss;
const getSettings = state => state.settings;
const getColors = state => state.colors;
const getIndicator = state => state.indicator;
const getLocationName = state => state.locationLabel;
const getSentences = state => state.sentences;

export const parseData = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (isEmpty(data)) return null;
    const { startYear, endYear, yearsRange } = settings;
    const years = yearsRange.map(yearObj => yearObj.value);
    const fillObj = {
      area: 0,
      biomassLoss: 0,
      bound1: null,
      emissions: 0,
      percentage: 0
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
        .filter(d => d.year >= startYear && d.year <= endYear)
        .map(d => ({
          ...d,
          co2LossByYear: d.emissions,
          biomassLoss: d.biomassLoss
        }))
    );
  }
);

export const parseConfig = createSelector(
  [getSettings, getColors],
  (settings, colors) => {
    const { unit } = settings;
    const { loss } = colors;
    return {
      height: 250,
      xKey: 'year',
      yKeys: {
        bars: {
          [unit]: {
            fill: loss.main,
            background: false
          }
        }
      },
      xAxis: {
        tickFormatter: yearTicksFormatter
      },
      tooltip: [
        {
          key: 'year'
        },
        {
          key: [unit],
          unit: 't',
          unitFormat: value => format('.3s')(value)
        }
      ],
      unit: 't',
      unitFormat: value => format('.2s')(value)
    };
  }
);

export const parseSentence = createSelector(
  [parseData, getSettings, getIndicator, getSentences, getLocationName],
  (data, settings, indicator, sentence, locationName) => {
    if (!data || isEmpty(data)) return null;
    const { startYear, endYear, unit } = settings;
    const totalBiomass = data
      .map(d => d[unit])
      .reduce((sum, d) => (d ? sum + d : sum));
    const emissionType =
      unit === 'biomassLoss' ? 'aboveground biomass' : 'CO\u2082';
    let indicatorText = '';
    if (indicator && indicator.value === 'mining') {
      indicatorText = ` ${indicator.label} regions`;
    } else if (indicator) {
      indicatorText = ` ${indicator.label}`;
    }

    const params = {
      type: emissionType,
      value: formatNumber({ num: totalBiomass, unit: 't' }),
      location: locationName,
      annualAvg: formatNumber({ num: totalBiomass / data.length, unit: 't' }),
      startYear,
      endYear,
      indicatorText
    };
    return { sentence, params };
  }
);

export default createStructuredSelector({
  data: parseData,
  config: parseConfig,
  sentence: parseSentence
});
