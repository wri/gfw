import { createSelector } from 'reselect';
import { format } from 'd3-format';
import isEmpty from 'lodash/isEmpty';
import { biomassToCO2, biomassToC } from 'utils/calculations';
import { getColorPalette } from 'utils/data';

// get list data
const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getIndicator = state => state.indicator || null;
const getColors = state => state.colors || null;

export const chartData = createSelector(
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

export const chartConfig = createSelector(
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
      unit: 't',
      tooltip: [
        {
          key: [unit],
          unit: 't',
          unitFormat: value => format('.3s')(value)
        }
      ]
    };
  }
);

export const getSentence = createSelector(
  [chartData, getSettings, getIndicator],
  (data, settings, indicator) => {
    if (!data || isEmpty(data) || !indicator) return null;

    const { startYear, endYear, unit } = settings;
    const totalEmissions = data
      .map(d => d[unit])
      .reduce((sum, d) => (d ? sum + d : sum));
    const emissionType = unit === 'biomassCarbon' ? 'carbon' : 'CO2';
    let indicatorText = '';
    if (indicator.value === 'mining') {
      indicatorText = ` in ${indicator.label.toLowerCase()} regions`;
    } else if (indicator.value !== 'gadm28') {
      indicatorText = ` in ${indicator.label.toLowerCase()}`;
    }
    return `Between <b>${startYear}</b> and <b>${endYear}</b>, <b>${format(
      '.3s'
    )(
      totalEmissions
    )}t</b> of <b>${emissionType}</b> was released into the atmosphere as a result of forest loss${indicatorText}</b>.`;
  }
);
