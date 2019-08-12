import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import { format } from 'd3-format';
import { sortByKey } from 'utils/data';

const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getLocationName = state => state.locationName || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config.sentence || null;

export const parseData = createSelector(
  [getData],
  (plantations, extent, plantationKeys, meta, location, embed) => {
    if (isEmpty(plantations) || isEmpty(meta) || isEmpty(extent)) return null;
    let groupKey = 'iso';
    if (location.payload.adm0) groupKey = 'adm1';
    if (location.payload.adm1) groupKey = 'adm2';
    const groupedByRegion = groupBy(plantations, groupKey);
    const regionData = Object.keys(groupedByRegion).map(r => {
      const yKeys = {};
      const regionId = parseInt(r, 10);
      const regionLabel =
        meta && meta.find(region => region.value === regionId);
      const totalRegionPlantations =
        sumBy(groupedByRegion[regionId], 'intersection_area') || 0;
      const regionExtent = extent.find(
        e => parseInt(e[groupKey], 10) === regionId
      );
      const totalArea = regionExtent && regionExtent.total_area;
      plantationKeys.forEach(key => {
        const labelFromKey = groupedByRegion[regionId].find(
          p => p.plantations === key
        );
        const pExtent = labelFromKey && labelFromKey.intersection_area;
        const pPercentage = pExtent / totalRegionPlantations * 100;
        yKeys[key] = pPercentage || 0;
        yKeys[`${key} label`] = key;
      });
      const { payload, query, type } = location;

      return {
        region: regionLabel && regionLabel.label,
        ...yKeys,
        total: totalRegionPlantations / totalArea * 100,
        path: {
          type,
          payload: {
            ...payload,
            ...(payload.adm1 && {
              adm2: regionId
            }),
            ...(!payload.adm1 && {
              adm1: regionId
            })
          },
          query: {
            ...query,
            map: {
              ...(query && query.map),
              canBound: true
            }
          }
        },
        extLink: embed
      };
    });
    const dataParsed = sortByKey(regionData, 'total', true);

    return dataParsed;
  }
);

export const parseConfig = createSelector(
  [getData, getColors, getSettings],
  (dataKeys, colors, settings) => {
    if (!dataKeys) return null;
    const colorsByType =
      settings.type === 'bound1' ? colors.types : colors.species;
    return {
      colors: colorsByType,
      unit: '%',
      xKey: 'region',
      yKeys: dataKeys,
      yAxisDotFill: '#d4d4d4',
      tooltip: dataKeys.map(item => ({
        key: item,
        label: item,
        color: colorsByType[item],
        unit: '%',
        unitFormat: value => format('.1f')(value)
      }))
    };
  }
);

export const parseSentence = createSelector(
  [parseData, getLocationName, getSentences],
  (data, locationName, sentence) => {
    if (!data || !data.length) return null;
    const params = {
      fromYear: 2001,
      toYear: 2011,
      firstCategory: 'Forest',
      secondCategory: 'Wetlands',
      amount: '232Mha',
      percentage: '7.3%'
    };
    return {
      sentence,
      params
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  dataConfig: parseConfig,
  sentence: parseSentence
});
