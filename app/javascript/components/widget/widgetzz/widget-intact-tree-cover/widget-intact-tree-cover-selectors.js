import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { getColorPalette } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getLocationNames = state => state.locationNames;
const getActiveIndicator = state => state.activeIndicator;
const getColors = state => state.colors;
const getIndicatorWhitelist = state => state.whitelist;

// get lists selected
export const getIntactTreeCoverData = createSelector(
  [getData, getSettings, getIndicatorWhitelist, getColors],
  (data, settings, whitelist, colors) => {
    if (isEmpty(data) || isEmpty(whitelist)) return null;
    const { totalArea, totalExtent, extent, plantations } = data;
    const hasPlantations = Object.keys(whitelist).indexOf('plantations') > -1;
    const colorRange = getColorPalette(colors.ramp, hasPlantations ? 3 : 2);
    const parsedData = [
      {
        label: 'Intact Forest',
        value: extent,
        color: colorRange[0],
        percentage: extent / totalArea * 100
      },
      {
        label: hasPlantations ? 'Degraded Forest' : 'Other Tree Cover',
        value: totalExtent - extent - plantations,
        color: colorRange[1],
        percentage: (totalExtent - extent - plantations) / totalArea * 100
      },
      {
        label: 'Non-Forest',
        value: totalArea - totalExtent,
        color: colors.nonForest,
        percentage: (totalArea - totalExtent) / totalArea * 100
      }
    ];
    if (hasPlantations) {
      parsedData.splice(2, 0, {
        label: 'Plantations',
        value: plantations,
        color: colorRange[2],
        percentage: plantations / totalArea * 100
      });
    }
    return parsedData;
  }
);

export const getSentence = createSelector(
  [getIntactTreeCoverData, getSettings, getLocationNames, getActiveIndicator],
  (parsedData, settings, locationNames, indicator) => {
    if (!parsedData || !locationNames) return null;
    const totalExtent = parsedData
      .filter(d => d.label !== 'Non-Forest')
      .map(d => d.value)
      .reduce((sum, d) => sum + d);
    const intactPercentage =
      parsedData.find(d => d.label === 'Intact Forest').value /
      totalExtent *
      100;
    const locationLabel = locationNames.current && locationNames.current.label;
    let sentenceLocation;

    switch (indicator.value) {
      case 'ifl_2013__mining':
        sentenceLocation = '<b>Mining concessions</b>';
        break;

      case 'ifl_2013__wdpa':
        sentenceLocation = '<b>Protected areas</b>';
        break;

      default:
        sentenceLocation = '<b>Intact forest</b>';
    }

    const lessThanCheck =
      intactPercentage < 0.01
        ? 'less than <b>0.1%</b> '
        : `<strong>${format('.1f')(intactPercentage)}%</strong> `;

    const sentence = `${
      indicator.value === 'ifl_2013'
        ? `In <b>${locationLabel}</b>, ${
          lessThanCheck
        } of tree cover is <b>intact forest</b>.`
        : `Within <b>${sentenceLocation}</b> in <b>${locationLabel}</b>, ${
          lessThanCheck
        } of tree cover is <b>intact forest</b>.`
    }`;

    return sentence;
  }
);
