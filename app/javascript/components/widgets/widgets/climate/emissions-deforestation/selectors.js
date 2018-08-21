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
        co2Emissions: biomassToCO2(d.emissions),
        biomass: d.emissions
      }));
  }
);

export const parseConfig = createSelector(
  [getSettings, getColors],
  (settings, colors) => {
    const colorRange = getColorPalette(colors.ramp, 2);
    const { unit } = settings;
    return {
      height: 250,
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
    const totalBiomass = data
      .map(d => d.biomass)
      .reduce((sum, d) => (d ? sum + d : sum));
    const emissionType = unit === 'biomassCarbon' ? 'carbon' : 'CO\u2082';
    const totalEmissions =
      unit === 'biomassCarbon'
        ? biomassToC(totalBiomass) * 1e-6
        : biomassToCO2(totalBiomass) * 1e-6;
    let indicatorText = '';
    if (indicator && indicator.value === 'mining') {
      indicatorText = ` ${indicator.label.toLowerCase()} regions`;
    } else if (indicator) {
      indicatorText = ` ${indicator.label.toLowerCase()}`;
    }

    const params = {
      type: emissionType,
      value:
        unit === 'biomassCarbon'
          ? `${format('.3r')(totalEmissions)}Tg`
          : `${format('.3r')(totalEmissions)}Mt`,
      location: currentLabel,
      startYear,
      endYear,
      indicatorText
    };
    const sentence = indicatorText ? containsIndicator : initial;
    return { sentence, params };
  }
);
