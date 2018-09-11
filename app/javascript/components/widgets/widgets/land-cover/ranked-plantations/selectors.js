import { createSelector } from 'reselect';
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
const getLocation = state => state.location || null;
const getQuery = state => state.search || null;
const getLocationsMeta = state =>
  (state.location.region ? state.subRegions : state.regions) || null;
const getCurrentLocation = state => state.currentLabel || null;
const getColors = state => state.colors || null;
const getEmbed = state => state.embed || null;
const getSentences = state => state.config.sentences || null;

const getPlanationKeys = createSelector(
  [getPlantations],
  plantations =>
    (plantations ? Object.keys(groupBy(plantations, 'label')) : null)
);

export const parseData = createSelector(
  [
    getPlantations,
    getExtent,
    getPlanationKeys,
    getLocationsMeta,
    getLocation,
    getQuery,
    getEmbed
  ],
  (plantations, extent, plantationKeys, meta, location, query, embed) => {
    if (isEmpty(plantations) || isEmpty(meta) || isEmpty(extent)) return null;
    const groupedByRegion = groupBy(plantations, 'region');
    const regionData = Object.keys(groupedByRegion).map(r => {
      const yKeys = {};
      const regionId = parseInt(r, 10);
      const regionLabel =
        meta && meta.find(region => region.value === regionId);
      const totalRegionPlantations = sumBy(
        groupedByRegion[regionId],
        'plantation_extent'
      );
      const totalArea = extent.find(e => e.region === regionId).total;
      plantationKeys.forEach(key => {
        const labelFromKey = groupedByRegion[regionId].find(
          p => p.label === key
        );
        const pExtent = labelFromKey && labelFromKey.plantation_extent;
        const pPercentage = pExtent / totalRegionPlantations * 100;
        yKeys[key] = pPercentage || 0;
        yKeys[`${key} label`] = key;
      });

      return {
        region: regionLabel && regionLabel.label,
        ...yKeys,
        total: totalRegionPlantations / totalArea * 100,
        path: `${
          embed ? `http://${window.location.host}` : ''
        }/dashboards/country/${location.country}/${
          location.region ? `${location.region}/` : ''
        }${regionId}${query ? `?${query}` : ''}`,
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

export const getSentence = createSelector(
  [parseData, getSettings, getLocation, getCurrentLocation, getSentences],
  (data, settings, location, currentLabel, sentences) => {
    if (!data || !data.length) return null;
    const { initial } = sentences;
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
      location: currentLabel,
      region: topRegion.region,
      topType: `${plantationLabel}${isPlural ? 's' : ''} plantations`,
      percentage: `${format('.2r')(data[0].total)}%`
    };

    return {
      sentence: initial,
      params
    };
  }
);
