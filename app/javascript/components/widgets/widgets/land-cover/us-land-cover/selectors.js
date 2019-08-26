import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';
import maxBy from 'lodash/maxBy';
import sumBy from 'lodash/sumBy';
import findIndex from 'lodash/findIndex';

import { formatNumber } from 'utils/format';

const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getLocationName = state => state.locationName || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config.sentence || null;

export const cleanData = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (isEmpty(data)) return null;
    const { variable } = settings;
    let { source } = settings;
    if (!source) source = 'ipcc';
    if (variable === 'changes_only') {
      return data.filter(
        d => d[`from_class_${source}`] !== d[`to_class_${source}`]
      );
    }
    return data;
  }
);

export const parseData = createSelector(
  [cleanData, getColors, getSettings],
  (data, colors, settings) => {
    if (isEmpty(data)) return null;
    let { source } = settings;
    const categories = {
      forest_land: 'Forest',
      bare: 'Bare',
      settlement: 'Settlement',
      cropland: 'Agriculture',
      grassland: 'Grassland',
      wetland: 'Wetland'
    };

    if (!source) source = 'ipcc';
    const nodes = [
      ...Object.keys(groupBy(data, `from_class_${source}`)).map(node => ({
        name: categories[node] ? categories[node] : 'Other',
        key: `${node}-start`,
        color: categories[node]
          ? colors.categories[categories[node]]
          : colors.categories.Other
      })),
      ...Object.keys(groupBy(data, `to_class_${source}`)).map(node => ({
        name: categories[node] ? categories[node] : 'Other',
        key: `${node}-end`,
        color: categories[node]
          ? colors.categories[categories[node]]
          : colors.categories.Other
      }))
    ];
    const allLinks = data.map(d => {
      const sourceIndex = findIndex(nodes, {
        key: `${d[`from_class_${source}`]}-start`
      });
      const targetIndex = findIndex(nodes, {
        key: `${d[`to_class_${source}`]}-end`
      });
      return {
        source: sourceIndex,
        target: targetIndex,
        value: d.area,
        key: `${sourceIndex}_${targetIndex}`
        // abs_pct: d.perc_area
      };
    });
    const links = Object.values(groupBy(allLinks, 'key')).map(group => {
      const link = group[0] || {};
      return {
        ...link,
        value: sumBy(group, 'value')
      };
    });
    return { nodes, links };
  }
);

export const parseConfig = createSelector([parseData], dataKeys => {
  if (isEmpty(dataKeys)) return null;
  // const colorsByType = settings.type === 'bound1' ? colors.types : colors.species;
  // return {
  //   colors: colorsByType,
  //   unit: '%',
  //   xKey: 'region',
  //   yKeys: dataKeys,
  //   yAxisDotFill: '#d4d4d4',
  //   tooltip: dataKeys.map(item => ({
  //     key: item,
  //     label: item,
  //     color: colorsByType[item],
  //     unit: '%',
  //     unitFormat: value => format('.1f')(value)
  //   }))
  // };
  return {};
});

export const parseSentence = createSelector(
  [parseData, getLocationName, getSettings, getSentences],
  (data, locationName, settings, sentence) => {
    if (isEmpty(data)) return null;
    const max = data.links && maxBy(data.links, 'value');
    const { startYear, endYear } = settings;
    const source = data.nodes[max.source];
    const target = data.nodes[max.target];
    const params = {
      startYear,
      endYear,
      firstCategory: source && source.name,
      secondCategory: target && target.name,
      amount: formatNumber({ num: max.value, unit: 'ha' }),
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
