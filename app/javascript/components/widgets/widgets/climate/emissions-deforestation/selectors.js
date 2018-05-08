import { createSelector } from 'reselect';
import { format } from 'd3-format';
import isEmpty from 'lodash/isEmpty';
import { biomassToCO2, biomassToC } from 'utils/calculations';
import { getColorPalette } from 'utils/data';

// get list data
const getData = state => (state.data && state.data.loss) || null;
const getSettings = state => state.settings || null;
const getIndicator = state => state.indicator || null;
const getCurrentLabel = state => state.currentLabel || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentences;

export const parseData = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (!data || isEmpty(data)) return null;

    const { startYear, endYear } = settings;
    return data
      .filter(d => d.year >= startYear && d.year <= endYear)
      .map(d => ({
        ...d,
        biomassCarbon: biomassToC(d.emissions),
        co2Emissions: biomassToCO2(d.emissions)
      }));
  }
);

export const parseConfig = createSelector(
  [getSettings, getColors],
  (settings, colors) => {
    const colorRange = getColorPalette(colors.ramp, 2);
    const { unit } = settings;
    return {
      xKey: 'year',
      yKeys: {
        areas: {
          [unit]: {
            fill: colorRange[0],
            background: false,
            activeDot: true
          }
        }
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

export const getSentence = createSelector(
  [parseData, getSettings, getIndicator, getSentences, getCurrentLabel],
  (data, settings, indicator, sentences, currentLabel) => {
    if (!data || isEmpty(data)) return null;
    const { initial, containsIndicator } = sentences;
    const { startYear, endYear, unit } = settings;
    const totalEmissions = data
      .map(d => d[unit])
      .reduce((sum, d) => (d ? sum + d : sum));
    const emissionType = unit === 'biomassCarbon' ? 'carbon' : 'CO2';
    let indicatorText = '';
    if (indicator && indicator.value === 'mining') {
      indicatorText = ` ${indicator.label.toLowerCase()} regions`;
    } else if (indicator) {
      indicatorText = ` ${indicator.label.toLowerCase()}`;
    }

    const params = {
      type: emissionType,
      value: `${format('.3s')(totalEmissions)}t`,
      location: currentLabel,
      startYear,
      endYear,
      indicatorText
    };
    const sentence = indicatorText ? containsIndicator : initial;
    return { sentence, params };
  }
);
