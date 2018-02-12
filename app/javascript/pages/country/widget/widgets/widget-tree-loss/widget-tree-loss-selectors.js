import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import { format } from 'd3-format';
import moment from 'moment';
import { biomassToCO2 } from 'utils/calculations';

// get list data
const getLoss = state => state.loss || null;
const getExtent = state => state.extent || null;
const getSettings = state => state.settings || null;
const getLocationNames = state => state.locationNames || null;
const getActiveIndicator = state => state.activeIndicator || null;
const getColors = state => state.colors || null;

// get lists selected
export const chartData = createSelector(
  [getLoss, getExtent, getSettings],
  (data, extent, settings) => {
    if (!data || isEmpty(data)) return null;
    const { startYear, endYear } = settings;

    return data
      .filter(d => d.year >= startYear && d.year <= endYear)
      .map(d => ({
        ...d,
        area: d.area || 0,
        emissions: d.emissions || 0,
        percentage: (d.area && d.area && d.area / extent * 100) || 0
      }));
  }
);

export const chartConfig = createSelector([getColors], colors => ({
  xKey: 'year',
  yKeys: {
    bars: {
      area: {
        fill: colors.main,
        background: false
      }
    }
  },
  xAxis: {
    tickFormatter: tick => {
      const year = moment(tick, 'YYYY');
      if ([2001, 2016].includes(tick)) {
        return year.format('YYYY');
      }
      return year.format('YY');
    }
  },
  unit: 'ha',
  tooltip: [
    {
      key: 'year'
    },
    {
      key: 'area',
      unit: 'ha'
    },
    {
      key: 'percentage',
      unit: '%'
    }
  ]
}));

export const getSentence = createSelector(
  [chartData, getExtent, getSettings, getLocationNames, getActiveIndicator],
  (data, extent, settings, locationNames, indicator) => {
    if (!data) return null;
    const { startYear, endYear, extentYear } = settings;
    const locationLabel = locationNames.current && locationNames.current.label;
    const locationIntro = `${
      indicator.value !== 'gadm28'
        ? `<b>${indicator.label}</b> in <b>${locationLabel}</b>`
        : `<b>${locationLabel}</b>`
    }`;
    const totalLoss = (data && data.length && sumBy(data, 'area')) || 0;
    const totalEmissions =
      (data && data.length && biomassToCO2(sumBy(data, 'emissions'))) || 0;
    const percentageLoss =
      (totalLoss && extent && totalLoss / extent * 100) || 0;

    return `Between <span>${startYear}</span> and <span>${endYear}</span>, ${locationIntro} lost <b>${format(
      '.3s'
    )(totalLoss)}ha</b> of tree cover${totalLoss ? '.' : ','} ${
      totalLoss > 0
        ? ` This loss is equal to <b>${format('.1f')(percentageLoss)}
      %</b> of the area's tree cover extent in <b>${extentYear}</b>,
      and equivalent to <b>${format('.3s')(
    totalEmissions
  )}t</b> of CO\u2082 emissions`
        : ''
    }.`;
  }
);
