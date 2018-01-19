import { createSelector } from 'reselect';
import COLORS from 'pages/country/data/colors.json';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import { getColorPalette } from 'utils/data';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getLocationNames = state => state.locationNames;
const getActiveIndicator = state => state.activeIndicator;
const getIndicatorWhitelist = state => state.whitelist;

// get lists selected
export const getTreeCoverPlantationsData = createSelector(
  [getData, getSettings, getIndicatorWhitelist],
  (data, settings, whitelist) => {
    if (isEmpty(data) || isEmpty(whitelist)) return null;
    const { plantations } = data;
    const totalPlantations = sumBy(plantations, 'plantation_extent');
    const colorRange = getColorPalette(
      [COLORS.darkGreen, COLORS.nonForest],
      plantations.length
    );
    return plantations.map((d, i) => ({
      label: d.bound2,
      value: d.plantation_extent,
      color: colorRange[i],
      percentage: d.plantation_extent / totalPlantations * 100
    }));
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
