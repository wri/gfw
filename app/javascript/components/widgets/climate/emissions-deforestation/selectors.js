import { createSelector, createStructuredSelector } from 'reselect';
import { format } from 'd3-format';
import isEmpty from 'lodash/isEmpty';
import { formatNumber } from 'utils/format';
import { yearTicksFormatter } from 'components/widget/utils/data';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings || null;
const getColors = state => state.colors;
const getIndicator = state => state.indicator || null;
const getLocationName = state => state.locationName || null;
const getSentences = state => state.config && state.config.sentences;

export const parseData = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (!data || isEmpty(data)) return null;
    const { startYear, endYear } = settings;
    return (
      data &&
      data.filter(d => d.year >= startYear && d.year <= endYear).map(d => ({
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
      indicatorText = ` ${indicator.label.toLowerCase()} regions`;
    } else if (indicator) {
      indicatorText = ` ${indicator.label.toLowerCase()}`;
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
  dataConfig: parseConfig,
  sentence: parseSentence
});
