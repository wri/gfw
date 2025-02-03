import { createSelector, createStructuredSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import { formatNumber } from 'utils/format';

// get list data
const getData = (state) => state.data;
const getSettings = (state) => state.settings;
const getLocationData = (state) => state.locationData;
const getLocation = (state) => state.location;
const getColors = (state) => state.colors;
const getAdm0 = (state) => state.adm0;
const getAdm1 = (state) => state.adm1;
const getAdm2 = (state) => state.adm2;
const getSentences = (state) => state && state.sentences;
const getTitle = (state) => state.title;
const getLocationName = (state) => state.locationLabel;

export const getSortedData = createSelector(
  [getData, getSettings, getAdm1, getAdm2],
  (data, settings, adm1, adm2) => {
    if (isEmpty(data)) return null;

    let regionKey = 'iso';
    if (adm1) regionKey = 'adm1';
    if (adm2) regionKey = 'adm2';
    const mappedData = data.map((d) => ({
      id: adm1 ? parseInt(d[regionKey], 10) : d[regionKey],
      ...d,
    }));
    return sortBy(
      uniqBy(mappedData, 'id'),
      settings.unit === 'totalBiomass' ? 'biomass' : 'biomassDensity'
    )
      .reverse()
      .map((d, i) => ({
        ...d,
        rank: i + 1,
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
    getColors,
  ],
  (data, settings, adm0, location, parentData, colors) => {
    if (isEmpty(data)) return null;
    let dataTrimmed = [];
    data.forEach((d) => {
      const locationMeta = parentData && parentData[d.id];

      if (locationMeta) {
        dataTrimmed.push({
          ...d,
          label: locationMeta.label,
          path: locationMeta.path,
        });
      }
    });
    dataTrimmed = dataTrimmed.map((d, i) => ({
      ...d,
      rank: i + 1,
    }));
    if (adm0) {
      const locationIndex = findIndex(
        dataTrimmed,
        (d) => d.id === (location && location.value)
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
    return dataTrimmed.map((d) => ({
      ...d,
      color: colors.carbon[0],
      unit: settings.unit === 'totalBiomass' ? 't' : 't/ha',
      value: settings.unit === 'totalBiomass' ? d.biomass : d.biomassDensity,
    }));
  }
);

export const parseSentence = createSelector(
  [getSortedData, getSettings, getLocation, getSentences],
  (data, settings, location, sentences) => {
    if (!sentences || isEmpty(data)) return null;

    // When looking at global data, it is processed differently;
    // There are two sentences to choose from depending on the settings.
    if (location && location.label === 'global') {
      let biomTop5 = 0;
      let densTop5 = 0;

      const biomTotal = data.reduce((acc, next, i) => {
        if (i < 5) {
          biomTop5 += next.biomass;
          densTop5 += next.biomassDensity;
        }
        return acc + next.biomass;
      }, 0);

      const percent = (biomTop5 / biomTotal) * 100;
      const avgBiomDensity = densTop5 / 5;

      const value =
        settings.unit === 'totalBiomass'
          ? formatNumber({ num: percent, unit: '%' })
          : formatNumber({
              num: avgBiomDensity,
              unit: 'tC/ha',
              spaceUnit: true,
            });

      const labels = {
        globalDensity: 'soil organic carbon density',
        globalBiomass: 'total carbon storage',
      };

      // Properties defined for labels and sentences are named in a way that relates with the display
      // but the units are somewhat fixed, due to their dependency on the whitelists for settings dropdowns.
      // We map them here.
      const sentenceLabelProperty =
        settings.unit === 'totalBiomass' ? 'globalBiomass' : 'globalDensity';
      const sentence = sentences[sentenceLabelProperty];
      const label = labels[sentenceLabelProperty];

      return {
        sentence,
        params: {
          label,
          value,
        },
      };
    }

    // Standard processing for adm1 and adm2 areas, same sentence, same formatting.
    const location_id = location && location.value;
    const region = data && data.find((item) => item.id === location_id);

    if (!region) return null;

    return {
      sentence: sentences.region,
      params: {
        location: location && location.label,
        biomassDensity: formatNumber({
          num: region.biomassDensity,
          unit: 'tC/ha',
          spaceUnit: true,
        }),
        totalBiomass: formatNumber({
          num: region.biomass,
          unit: 'tC',
          spaceUnit: true,
        }),
      },
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
  title: parseTitle,
});
