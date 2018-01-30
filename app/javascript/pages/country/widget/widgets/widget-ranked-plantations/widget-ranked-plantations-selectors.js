import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import maxBy from 'lodash/maxBy';
import remove from 'lodash/remove';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import { format } from 'd3-format';
import { sortByKey } from 'utils/data';
import endsWith from 'lodash/endsWith';

const getPlantations = state => state.plantations || null;
const getExtent = state => state.extent || null;
const getSettings = state => state.settings || null;
const getLocation = state => state.location || null;
const getLocationsMeta = state => state.meta || null;
const getLocationNames = state => state.locationNames || null;
const getColors = state => state.colors || null;

const getPlanationKeys = createSelector(
  [getPlantations],
  plantations =>
    (plantations ? Object.keys(groupBy(plantations, 'label')) : null)
);

export const chartData = createSelector(
  [getPlantations, getExtent, getPlanationKeys, getLocationsMeta, getLocation],
  (plantations, extent, plantationKeys, meta, location) => {
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
      const totalExtent = extent.find(e => e.region === regionId).extent;
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
        total: totalRegionPlantations / totalExtent * 100,
        path: `/country/${location.payload.country}/${
          location.payload.region ? `${location.payload.region}/` : ''
        }${regionId}${location.search ? `?${location.search}` : ''}`
      };
    });
    const dataParsed = sortByKey(regionData, 'total', true);

    return dataParsed;
  }
);

export const chartConfig = createSelector(
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
        unit: '%',
        unitFormat: '.2f',
        label: `${item} label`,
        color: colorsByType[item]
      }))
    };
  }
);

export const getSentence = createSelector(
  [chartData, getSettings, getLocation, getLocationNames],
  (data, settings, location, locationNames) => {
    if (!data) return null;

    const { type } = settings;
    const currentLocation =
      locationNames && locationNames.current && locationNames.current.label;
    const topRegion = data[0];
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
    const plantationLabel = topPlantation.label;
    const isPlural = endsWith(plantationLabel, 's');
    let sentence = '';
    if (type === 'bound1') {
      sentence = `<b>${
        topRegion.region
      }</b> has the largest relative tree cover due to plantations in <b>${currentLocation}</b>${
        location.payload.region ? ' ' : ''
      } at <b>${format('.1f')(
        data[0].total
      )}%</b>, most of which is in <b>${plantationLabel}${
        isPlural ? '' : 's'
      }</b>.`;
    } else {
      sentence = `Within <b>${currentLocation}</b>, <b>${(topRegion.region &&
        topRegion.region) ||
        ''}</b> has the largest relative area of plantation tree cover${
        location.payload.region ? ' extent' : ''
      } at <b>${format('.1f')(topRegion.total)}%</b>.`;
    }
    return sentence;
  }
);
