import { createSelector } from 'reselect';
import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';
import { format } from 'd3-format';

// get list data
const getLoss = state => state.loss || null;
const getTotalLoss = state => state.totalLoss || null;
const getExtent = state => state.extent || null;
const getSettings = state => state.settings || null;
const getLocationNames = state => state.locationNames || null;

// get lists selected
export const filterData = createSelector(
  [getLoss, getTotalLoss, getExtent, getSettings],
  (loss, totalLoss, extent, settings) => {
    if (!loss || !totalLoss) return null;
    const { startYear, endYear } = settings;
    const totalLossByYear = groupBy(totalLoss, 'year');

    return loss
      .filter(d => d.year >= startYear && d.year <= endYear)
      .map(d => ({
        ...d,
        lossLabel: 'Plantation loss:',
        outsideLossLabel: 'Loss outside plantations:',
        areaLoss: d.area || 0,
        co2Loss: d.emissions || 0,
        outsideAreaLoss: totalLossByYear[d.year][0].area - d.area,
        outsideCo2Loss: totalLossByYear[d.year][0].emissions - d.emissions,
        percentage: totalLossByYear[d.year][0].area / extent * 100 || 0
      }));
  }
);

export const getSentence = createSelector(
  [filterData, getExtent, getSettings, getLocationNames],
  (data, extent, settings, locationNames) => {
    if (!data) return null;
    const { startYear, endYear, threshold } = settings;
    const locationLabel = locationNames.current && locationNames.current.label;
    const totalLoss = sumBy(data, 'areaLoss') || 0;
    const totalOutsideLoss = sumBy(data, 'outsideAreaLoss') || 0;
    const totalEmissions = sumBy(data, 'emissions') || 0;
    const lossPhrase = totalLoss > totalOutsideLoss ? 'inside' : 'outside';

    return `The majority of tree cover loss from <span>${startYear}</span> to <span>${endYear}</span> in <b>${locationLabel}</b> occured <b>${lossPhrase}</b> of plantations, considering tree cover with canopy density greater than <b>${threshold}%</b>.
    The total loss is roughly equivalent to <b>${format('.2s')(
    totalEmissions
  )}tonnes of CO<sub>2</sub></b> emissions.`;
  }
);
