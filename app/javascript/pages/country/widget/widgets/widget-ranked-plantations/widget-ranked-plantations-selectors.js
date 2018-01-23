import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import uniqBy from 'lodash/uniqBy';
import { format } from 'd3-format';
import { sortByKey } from 'utils/data';

import PLANTATIONS_KEYS from 'pages/country/data/plantations-keys.json';

const getExtent = state => state.extent || null;
const getPlantations = state => state.plantations || null;
const getSettings = state => state.settings || null;
const getLocation = state => state.location || null;
const getLocationsMeta = state => state.meta || null;
const getLocationNames = state => state.locationNames || null;
const getDataKeys = () => PLANTATIONS_KEYS;

const sortedData = createSelector(
  [getExtent, getPlantations, getLocation, getSettings],
  (extent, plantations, location, settings) => {
    if (!extent || isEmpty(extent) || !plantations || isEmpty(plantations)) { return null; }

    const regionIds = plantations
      .map(item => (location.region ? item.adm2 : item.adm1))
      .filter((item, i, self) => self.indexOf(item) === i);
    const data = [];
    regionIds.forEach(region => {
      const selectedPlantations = plantations.filter(
        item => region === (location.region ? item.adm2 : item.adm1)
      );
      const regionPlantationsTotal =
        selectedPlantations.length === 1
          ? selectedPlantations[0].plantation_extent
          : selectedPlantations.reduce(
            (current, item) =>
              (current.plantation_extent
                ? current.plantation_extent + item.plantation_extent
                : current + item.plantation_extent)
          );
      const regionExtent = extent.filter(item => region === item.region)[0]
        .extent;
      const regionPlantations = selectedPlantations.map(item => ({
        name: item[settings.type],
        extent: item.plantation_extent
      }));

      data.push({
        region,
        plantations: regionPlantations,
        total: regionPlantationsTotal,
        percent: 100 * regionPlantationsTotal / regionExtent,
        extent: regionExtent
      });
    });
    return sortByKey(uniqBy(data, 'region'), 'percent', true);
  }
);

export const chartData = createSelector(
  [sortedData, getDataKeys, getSettings],
  (data, dataKeys, settings) => {
    if (!data) return null;

    const limit = 5;
    const filteredData = [];
    for (let i = 0; i < limit; i++) {
      filteredData.push(dataKeys[settings.type]);
    }
    const indexCount = dataKeys[settings.type];
    sortByKey(uniqBy(data, 'region'), 'percent', true).forEach(item => {
      item.plantations.forEach(plantation => {
        const key = plantation.name;
        const currentIndex = findIndex(indexCount, d => d.key === key);

        if (currentIndex !== -1 && indexCount[currentIndex].value < limit) {
          const filteredDataIndex = findIndex(
            filteredData[currentIndex],
            d => d.key === key
          );
          filteredData[currentIndex][filteredDataIndex].value =
            100 * plantation.extent / item.total;
          indexCount[currentIndex].value += 1;
        }
      });
    });
    return filteredData;
  }
);

export const getSentence = createSelector(
  [sortedData, getSettings, getLocationsMeta, getLocation, getLocationNames],
  (data, settings, meta, location, locationNames) => {
    if (!data || !meta || isEmpty(meta)) return null;

    const { type, extentYear, threshold } = settings;
    const region = meta.find(l => data[0].region === l.value);
    const currentLocation =
      locationNames && locationNames.current && locationNames.current.label;
    let sentence = '';
    if (type === 'bound1') {
      sentence = `<b>${(region && region.label) ||
        ''}</b> (<b>${extentYear}</b>) has the largest relative tree cover due to plantations (<b>${format(
        '.1f'
      )(data[0].percent)}%</b>) in <b>${currentLocation}</b>${
        location.region ? ` (<b>${extentYear})</b>` : ''
      }, most of which is <b>${
        data[0].plantations[0].name
      }</b> plantations where tree canopy is greater than <b>${threshold}%</b>.`;
    } else {
      sentence = `Within <b>${currentLocation}</b>, <b>${(region &&
        region.label) ||
        ''}</b> has the largest relative area of plantation tree cover${
        location.region ? ' extent' : ''
      } in <b>${extentYear}</b> at <b>${format('.1f')(
        data[0].percent
      )}%</b>, where tree canopy is greater than <b>${threshold}%</b>. The majority of this area is used for <b>${
        data[0].plantations[0].name
      }</b>.`;
    }
    return sentence;
  }
);
