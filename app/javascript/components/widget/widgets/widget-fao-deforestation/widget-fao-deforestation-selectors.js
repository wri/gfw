import { createSelector } from 'reselect';
import findIndex from 'lodash/findIndex';
import { format } from 'd3-format';
import { getActiveFilter } from '../../widget-selectors';

const getData = state => state.data || null;
const getLocation = state => state.location || null;
const getLocationNames = state => state.locationNames || null;
const getColors = state => state.colors || null;
const getSettings = state => state.settings || null;
const getOptions = state => state.options || null;

export const getFilteredData = createSelector(
  [getData, getLocation, getColors],
  (data, location, colors) => {
    if (!data || !data.rank.length) return null;

    const { rank } = data;
    const locationIndex = findIndex(rank, d => d.iso === location.country);
    let trimStart = locationIndex - 2;
    let trimEnd = locationIndex + 3;
    if (locationIndex < 2) {
      trimStart = 0;
      trimEnd = 5;
    }
    if (locationIndex > rank.length - 3) {
      trimStart = rank.length - 5;
      trimEnd = rank.length;
    }
    const dataTrimmed = rank.slice(trimStart, trimEnd);
    return dataTrimmed.map(d => ({
      ...d,
      label: d.name,
      color: colors.main,
      path: `/country/${d.iso}`,
      value: d.deforest
    }));
  }
);

export const getSentence = createSelector(
  [getData, getLocation, getLocationNames, getSettings, getOptions],
  (data, location, locationNames, settings, options) => {
    if (!data || !data.fao.length) return '';

    const topFao = data.fao.filter(d => d.year === settings.period);
    const { deforest, humdef } = topFao[0];
    const currentLocation =
      locationNames && locationNames.current && locationNames.current.label;
    const periods = options && options.periods;
    const period = getActiveFilter(settings, periods, 'period');

    if (deforest) {
      return `From <b>${period &&
        period.label}</b>, the rate of deforestation in <b>${
        currentLocation
      }</b> was <b>${format('.3s')(deforest)}ha/yr</b>${
        humdef
          ? `, of which <b>${format('.3s')(
            humdef
          )}ha/yr</b> was due to human activity`
          : ''
      }.`;
    }
    return `No deforestation data in <b>${currentLocation}</b>.`;
  }
);
