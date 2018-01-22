import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { getColorPalette } from 'utils/data';

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
    const colorRange = getColorPalette([colors.darkGreen, colors.lightGreen], 4);

    const parsedData = [
      {
        label: 'Intact Forest',
        value: extent,
        color: colorRange.darkGreen,
        percentage: extent / totalArea * 100
      },
      {
        label: hasPlantations ? 'Degraded Forest' : 'Other Tree Cover',
        value: totalExtent - extent - plantations,
        color: colorRange.lightGreen,
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
        color: colorRange.mediumGreen,
        percentage: plantations / totalArea * 100
      });
    }
    return parsedData;
  }
);

export const getSentence = createSelector(
  [getIntactTreeCoverData, getSettings, getLocationNames, getActiveIndicator],
  (data, settings, locationNames, indicator) => {
    if (!data || !locationNames) return null;
    const largestContrib = data.find(d => d.percentage >= 0.5);
    const locationLabel = locationNames.current && locationNames.current.label;
    const locationIntro = `For <b>${
      indicator.label
    }</b> in <b>${locationLabel}</b>,`;
    const first = `${locationIntro} the majority of tree cover is found in <b>${
      largestContrib.label
    }</b>, `;
    const second = `considering tree cover extent in <b>${
      settings.extentYear
    }</b> where tree canopy is greater than <b>${settings.threshold}%</b>.`;

    return `${first} ${second}`;
  }
);
