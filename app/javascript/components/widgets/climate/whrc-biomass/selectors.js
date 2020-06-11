import { createSelector, createStructuredSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import { sortByKey } from 'utils/data';
import { formatNumber } from 'utils/format';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getLocationData = state => state.locationData;
const getLocation = state => state.location;
const getColors = state => state.colors;
const getAdm0 = state => state.adm0;
const getAdm1 = state => state.adm1;
const getAdm2 = state => state.adm2;
const getSentences = state => state && state.sentences;
const getTitle = state => state.title;
const getLocationName = state => state.locationLabel;

export const getSortedData = createSelector(
  [getData, getSettings, getAdm1, getAdm2],
  (data, settings, adm1, adm2) => {
    if (isEmpty(data)) return null;
    let regionKey = 'iso';
    if (adm1) regionKey = 'adm1';
    if (adm2) regionKey = 'adm2';
    const mappedData = data.map(d => ({
      id: adm1 ? parseInt(d[regionKey], 10) : d[regionKey],
      ...d
    }));
    return sortByKey(
      uniqBy(mappedData, 'id'),
      settings.unit === 'totalBiomass' ? 'biomass' : 'biomassDensity',
      true
    ).map((d, i) => ({
      ...d,
      rank: i + 1
    }));
  }
);

export const parseData = createSelector(
  [
    getSortedData,
    getSettings,
    getAdm0,
    getLocation,
    getLocationData,
    getColors
  ],
  (data, settings, adm0, location, parentData, colors) => {
    if (isEmpty(data)) return null;
    let dataTrimmed = [];
    data.forEach(d => {
      const locationMeta = parentData && parentData[d.id];

      if (locationMeta) {
        dataTrimmed.push({
          ...d,
          label: locationMeta.label,
          path: locationMeta.path
        });
      }
    });
    dataTrimmed = dataTrimmed.map((d, i) => ({
      ...d,
      rank: i + 1
    }));
    if (adm0) {
      const locationIndex = findIndex(
        dataTrimmed,
        d => d.id === (location && location.value)
      );
      let trimStart = locationIndex - 2;
      let trimEnd = locationIndex + 3;
      if (locationIndex < 2) {
        trimStart = 0;
        trimEnd = 5;
      }
      if (locationIndex > dataTrimmed.length - 3) {
        trimStart = dataTrimmed.length - 5;
        trimEnd = dataTrimmed.length;
      }
      dataTrimmed = dataTrimmed.slice(trimStart, trimEnd);
    }
    return dataTrimmed.map(d => ({
      ...d,
      color: colors.carbon[0],
      unit: settings.unit === 'totalBiomass' ? 't' : 't/ha',
      value: settings.unit === 'totalBiomass' ? d.biomass : d.biomassDensity
    }));
  }
);

export const parseSentence = createSelector(
  [getSortedData, getSettings, getLocation, getSentences],
  (data, settings, location, sentences) => {
    if (!sentences || isEmpty(data)) return null;
    if (location && location.label === 'global') {
      const sortKey =
        settings.unit === 'totalBiomass' ? 'biomass' : 'biomassDensity';
      const sorted = sortByKey(data, [sortKey]).reverse();

      let biomTop5 = 0;
      let densTop5 = 0;
      const biomTotal = sorted.reduce((acc, next, i) => {
        if (i < 5) {
          biomTop5 += next.biomass;
          densTop5 += next.biomassDensity;
        }
        return acc + next.biomass;
      }, 0);

      const percent = biomTop5 / biomTotal * 100;
      const avgBiomDensity = densTop5 / 5;

      const value =
        settings.unit === 'biomass'
          ? formatNumber({ num: percent, unit: '%' })
          : formatNumber({ num: avgBiomDensity, unit: 't/ha' });

      const labels = {
        biomassDensity: 'biomass density',
        totalBiomass: 'total biomass'
      };
      return {
        sentence: sentences[settings.unit],
        params: {
          label: labels[settings.unit],
          value
        }
      };
    }
    const iso = location && location.value;
    const region =
      data &&
      data.find(item => {
        if (item.admin_2) return item.admin_2 === iso;
        else if (item.admin_1) return item.admin_1 === iso;
        return item.iso === iso;
      });
    if (!region) return null;

    const { biomassDensity, biomass } = region;
    return {
      sentence: sentences.initial,
      params: {
        location: location && location.label,
        biomassDensity: formatNumber({ num: biomassDensity, unit: 't/ha' }),
        totalBiomass: formatNumber({ num: biomass, unit: 't' })
      }
    };
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationName],
  (title, name) => {
    let selectedTitle = title.default;
    if (name === 'global') {
      selectedTitle = title.global;
    }
    return selectedTitle;
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
  title: parseTitle
});
