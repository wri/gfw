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
export const getTreeCoverData = createSelector(
  [getData, getSettings, getIndicatorWhitelist],
  (data, settings, whitelist) => {
    if (isEmpty(data) || isEmpty(whitelist)) return null;
    const { totalArea, cover, plantations } = data;
    const { indicator } = settings;
    const hasPlantations = Object.keys(whitelist).indexOf('plantations') > -1;
    const parsedData = [
      {
        label:
          hasPlantations && indicator === 'gadm28'
            ? 'Natural Forest'
            : 'Tree cover',
        value: cover - plantations,
        color: COLORS.darkGreen,
        percentage: (cover - plantations) / totalArea * 100
      },
      {
        label: 'Non-Forest',
        value: totalArea - cover,
        color: COLORS.nonForest,
        percentage: (totalArea - cover) / totalArea * 100
      }
    ];
    if (indicator === 'gadm28' && hasPlantations) {
      parsedData.splice(1, 0, {
        label: 'Tree plantations',
        value: plantations,
        color: COLORS.mediumGreen,
        percentage: plantations / totalArea * 100
      });
    }
    return parsedData;
  }
);

export const getSentence = createSelector(
  [getData, getSettings, getLocationNames, getActiveIndicator],
  (data, settings, locationNames, indicator) => {
    if (!data) return null;
    const { totalArea, cover } = data;
    const coverStatus = cover / totalArea > 0.5 ? 'tree covered' : 'non-forest';
    const locationLabel = locationNames.current && locationNames.current.label;
    const locationIntro = `${
      indicator.value !== 'gadm28'
        ? `<b>${indicator.label}</b> in <b>${locationLabel}</b> are `
        : `<b>${locationLabel}</b> is `
    }`;
    const first = `${locationIntro} mainly ${coverStatus}, `;
    const second = `considering tree cover extent in <b>${
      settings.extentYear
    }</b> where tree canopy is greater than <b>${settings.threshold}%</b>.`;

    return `${first} ${second}`;
  }
);
