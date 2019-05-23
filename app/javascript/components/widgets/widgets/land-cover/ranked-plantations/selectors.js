import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import maxBy from 'lodash/maxBy';
import remove from 'lodash/remove';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import { format } from 'd3-format';
import { sortByKey } from 'utils/data';
import endsWith from 'lodash/endsWith';

const getPlantations = state => (state.data && state.data.plantations) || null;
const getExtent = state => (state.data && state.data.extent) || null;
const getSettings = state => state.settings || null;
const getLocation = state => state.allLocation || null;
const getLocationsMeta = state => state.childLocationData;
const getLocationName = state => state.locationName || null;
const getColors = state => state.colors || null;
const getEmbed = state => state.embed || null;
const getSentences = state => state.config.sentence || null;

const getPlanationKeys = createSelector(
  [getPlantations],
  plantations =>
    (plantations ? Object.keys(groupBy(plantations, 'plantations')) : null)
);

export const parseData = createSelector(
  [
    getPlantations,
    getExtent,
    getPlanationKeys,
    getLocationsMeta,
    getLocation,
    getEmbed
  ],
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
      const totalArea = extent.find(e => e[groupKey] === regionId).total_area;
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
          query
        },
        extLink: embed
      };
    });
    const dataParsed = sortByKey(regionData, 'total', true);
    return dataParsed;
  }
);

export const parseConfig = createSelector(
  [getPlanationKeys, getColors, getSettings],
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
    const topRegion = data[0] || {};
    const topPlantation = maxBy(
      remove(
        Object.keys(topRegion).map(k => ({
          label: k,
          value: topRegion[k] > 0 ? topRegion[k] : 0
        })),
        item => item.label !== 'total'
      ),
      'value'
    );
    const plantationLabel = topPlantation.label.toLowerCase();
    const isPlural = endsWith(plantationLabel, 's');
    const params = {
      location: locationName,
      region: topRegion.region,
      topType: `${plantationLabel}${isPlural ? 's' : ''} plantations`,
      percentage: `${format('.2r')(data[0].total)}%`
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
