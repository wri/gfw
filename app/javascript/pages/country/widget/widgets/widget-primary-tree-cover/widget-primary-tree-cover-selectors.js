import { createSelector } from 'reselect';
import COLORS from 'pages/country/data/colors.json';
import isEmpty from 'lodash/isEmpty';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getLocationNames = state => state.locationNames;
const getActiveIndicator = state => state.activeIndicator;
const getIndicatorWhitelist = state => state.whitelist;

// get lists selected
export const getPrimaryTreeCoverData = createSelector(
  [getData, getSettings, getIndicatorWhitelist],
  (data, settings, whitelist) => {
    if (isEmpty(data) || isEmpty(whitelist)) return null;
    const { totalArea, totalExtent, extent, plantations } = data;
    const hasPlantations = Object.keys(whitelist).indexOf('plantations') > -1;
    const parsedData = [
      {
        label: 'Primary Forest',
        value: extent,
        color: COLORS.darkGreen,
        percentage: extent / totalArea * 100
      },
      {
        label: hasPlantations ? 'Secondary Forest' : 'Other Tree Cover',
        value: totalExtent - extent - plantations,
        color: COLORS.lightGreen,
        percentage: (totalExtent - extent - plantations) / totalArea * 100
      },
      {
        label: 'Non-Forest',
        value: totalArea - totalExtent,
        color: COLORS.nonForest,
        percentage: (totalArea - totalExtent) / totalArea * 100
      }
    ];
    if (hasPlantations) {
      parsedData.splice(2, 0, {
        label: 'Plantations',
        value: plantations,
        color: COLORS.mediumGreen,
        percentage: plantations / totalArea * 100
      });
    }
    return parsedData;
  }
);

export const getSentence = createSelector(
  [getPrimaryTreeCoverData, getSettings, getLocationNames, getActiveIndicator],
  (data, settings, locationNames, indicator) => {
    if (!data || !locationNames) return null;
    const largestContrib = data.find(d => d.percentage >= 0.5);
    const locationLabel = locationNames.current && locationNames.current.label;
    const locationIntro = `${
      indicator.value !== 'gadm28'
        ? `For <b>${indicator.label}</b> in <b>${locationLabel}</b>,`
        : `In <b>${locationLabel}</b>,`
    }`;
    const first = `${locationIntro} the majority of tree cover is found in <b>${
      largestContrib.label
    }</b>, `;
    const second = `considering tree cover extent in <b>${
      settings.extentYear
    }</b> where tree canopy is greater than <b>${settings.threshold}%</b>.`;

    return `${first} ${second}`;
  }
);
