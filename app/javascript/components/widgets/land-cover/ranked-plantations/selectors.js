import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import maxBy from 'lodash/maxBy';
import remove from 'lodash/remove';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import { format } from 'd3-format';
import { sortByKey } from 'utils/data';
import endsWith from 'lodash/endsWith';

const getPlantations = state => state.data && state.data.plantations;
const getExtent = state => state.data && state.data.extent;
const getSettings = state => state.settings;
const getAdm0 = state => state.adm0;
const getAdm1 = state => state.adm1;
const getLocationsMeta = state => state.childData;
const getLocationName = state => state.locationLabel;
const getColors = state => state.colors;
const getEmbed = state => state.embed;
const getSentences = state => state.sentence;

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
    getAdm0,
    getAdm1,
    getEmbed
  ],
  (plantations, extent, plantationKeys, meta, adm0, adm1, embed) => {
    if (isEmpty(plantations) || isEmpty(meta) || isEmpty(extent)) return null;
    let groupKey = 'iso';
    if (adm0) groupKey = 'adm1';
    if (adm1) groupKey = 'adm2';
    const groupedByRegion = groupBy(plantations, groupKey);
    const regionData = Object.keys(groupedByRegion).map(r => {
      const yKeys = {};
      const regionId = parseInt(r, 10);
      const regionLabel = meta && meta[regionId];
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

      return {
        region: regionLabel && regionLabel.label,
        ...yKeys,
        total: totalRegionPlantations / totalArea * 100,
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
  config: parseConfig,
  sentence: parseSentence
});
