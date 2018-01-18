import { createSelector } from 'reselect';
// import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';
import { format } from 'd3-format';

// get list data
const getLoss = state => state.loss || null;
const getTotalLoss = state => state.totalLoss || null;
const getExtent = state => state.extent || null;
const getSettings = state => state.settings || null;
const getLocationNames = state => state.locationNames || null;
const getActiveIndicator = state => state.activeIndicator || null;

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
  [filterData, getExtent, getSettings, getLocationNames, getActiveIndicator],
  (data, extent, settings, locationNames, indicator) => {
    if (!data) return null;
    const { startYear, endYear, extentYear, threshold } = settings;
    const locationLabel = locationNames.current && locationNames.current.label;
    const locationIntro = `${
      indicator.value !== 'gadm28'
        ? `<b>${indicator.label}</b> in <b>${locationLabel}</b>`
        : `<b>${locationLabel}</b>`
    }`;
    const totalLoss = (data && data.length && sumBy(data, 'area')) || 0;
    const totalEmissions =
      (data && data.length && sumBy(data, 'emissions')) || 0;
    const percentageLoss =
      (totalLoss && extent && totalLoss / extent * 100) || 0;

    return `Between <span>${startYear}</span> and <span>${endYear}</span>, ${locationIntro} lost <b>${format(
      '.3s'
    )(totalLoss)}ha</b> of tree cover${totalLoss ? '.' : ','} ${
      totalLoss > 0
        ? ` This loss is equal to <b>${format('.1f')(percentageLoss)}
      %</b> of the regions tree cover extent in <b>${extentYear}</b>, 
      and equivalent to <b>${format('.3s')(totalEmissions)}
      tonnes</b> of CO\u2082 emissions`
        : ''
    }
     with canopy density <span>> ${threshold}%</span>.`;
  }
);
