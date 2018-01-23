import { createSelector } from 'reselect';
import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';
import { format } from 'd3-format';
import { biomassToCO2 } from 'utils/calculations';
import { getColorPalette } from 'utils/data';

// get list data
const getLoss = state => state.loss || null;
const getTotalLoss = state => state.totalLoss || null;
const getSettings = state => state.settings || null;
const getLocationNames = state => state.locationNames || null;
const getColors = state => state.colors || null;

// get lists selected
export const chartData = createSelector(
  [getLoss, getTotalLoss, getSettings],
  (loss, totalLoss, settings) => {
    if (!loss || !totalLoss) return null;
    const { startYear, endYear } = settings;
    const totalLossByYear = groupBy(totalLoss, 'year');

    return loss
      .filter(d => d.year >= startYear && d.year <= endYear)
      .map(d => ({
        ...d,
        outsideLossLabel: 'Outside plantations',
        lossLabel: 'Plantations',
        outsideAreaLoss: totalLossByYear[d.year][0].area - d.area,
        areaLoss: d.area || 0,
        outsideCo2Loss: totalLossByYear[d.year][0].emissions - d.emissions,
        co2Loss: d.emissions || 0
      }));
  }
);

export const chartConfig = createSelector([getColors], colors => {
  const colorRange = getColorPalette(colors.ramp, 2);
  return {
    xKey: 'year',
    yKeys: ['areaLoss', 'outsideAreaLoss'],
    colors: {
      areaLoss: colorRange[0],
      outsideAreaLoss: colorRange[1]
    },
    unit: 'ha',
    tooltip: [
      {
        key: 'outsideAreaLoss',
        unit: 'ha',
        label: 'outsideLossLabel'
      },
      {
        key: 'areaLoss',
        unit: 'ha',
        label: 'lossLabel'
      }
    ]
  };
});

export const getSentence = createSelector(
  [chartData, getSettings, getLocationNames],
  (data, settings, locationNames) => {
    if (!data) return null;
    const { startYear, endYear, threshold } = settings;
    const locationLabel = locationNames.current && locationNames.current.label;
    const totalLoss = sumBy(data, 'areaLoss') || 0;
    const totalOutsideLoss = sumBy(data, 'outsideAreaLoss') || 0;
    const totalEmissions = biomassToCO2(sumBy(data, 'emissions')) || 0;
    const lossPhrase = totalLoss > totalOutsideLoss ? 'inside' : 'outside';

    return `The majority of tree cover loss from <span>${startYear}</span> to <span>${endYear}</span> in <b>${locationLabel}</b> occured <b>${lossPhrase}</b> of plantations, considering tree cover with canopy density greater than <b>${threshold}%</b>.
    The total loss is roughly equivalent to <b>${format('.2s')(
    totalEmissions
  )}t of CO<sub>2</sub></b> emissions.`;
  }
);
