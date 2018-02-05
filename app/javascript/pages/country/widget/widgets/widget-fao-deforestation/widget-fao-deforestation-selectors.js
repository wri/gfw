import { createSelector } from 'reselect';
import findIndex from 'lodash/findIndex';
import { format } from 'd3-format';

const getData = state => state.data || null;
const getLocation = state => state.location || null;
const getLocationNames = state => state.locationNames || null;
const getColors = state => state.colors || null;

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
  [getData, getLocation, getLocationNames],
  (data, location, locationNames) => {
    if (!data || !data.fao.length) return '';

    const topFao = data.fao[0];
    const currentLocation =
      locationNames && locationNames.current && locationNames.current.label;
    return `From <b>${topFao.year}–${
      data.fao[data.fao.length - 1].year
    }</b>, the rate of deforestation in <b>${currentLocation}</b> was <b>${format(
      '.3s'
    )(topFao.deforest)}ha/yr</b>${
      topFao.humdef
        ? `, of which <b>${format('.3s')(
          topFao.humdef
        )}ha/yr</b> was due to human activity`
        : ''
    }.`;
  }
);
