import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';
import findIndex from 'lodash/findIndex';

const getData = state => state.data || null;
// const getSettings = state => state.settings || null;
const getLocationName = state => state.locationName || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config.sentence || null;

export const cleanData = createSelector([getData], data => {
  if (isEmpty(data)) return null;
  return data.filter(d => d.start !== d.end);
});

export const parseData = createSelector(
  [cleanData, getColors],
  (data, colors) => {
    if (isEmpty(data)) return null;
    const categories = {
      forest: 'Forest',
      bare: 'Bare',
      settlements: 'Settlement',
      cropland: 'Agriculture',
      grassland: 'Grassland',
      wetlands: 'Wetland'
    };
    const nodes = [
      ...Object.keys(groupBy(data, 'start')).map(node => ({
        name: categories[node] ? categories[node] : 'Other',
        key: `${node}-start`,
        color: categories[node]
          ? colors.categories[categories[node]]
          : colors.categories.Other
      })),
      ...Object.keys(groupBy(data, 'end')).map(node => ({
        name: categories[node] ? categories[node] : 'Other',
        key: `${node}-end`,
        color: categories[node]
          ? colors.categories[categories[node]]
          : colors.categories.Other
      }))
    ];
    const links = data.map(d => ({
      source: findIndex(nodes, { key: `${d.start}-start` }),
      target: findIndex(nodes, { key: `${d.end}-end` }),
      value: d.area,
      abs_pct: d.perc_area
    }));
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
