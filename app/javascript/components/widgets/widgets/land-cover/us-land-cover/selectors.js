import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';
import maxBy from 'lodash/maxBy';
import sumBy from 'lodash/sumBy';
import orderBy from 'lodash/orderBy';
import findIndex from 'lodash/findIndex';

import { formatNumber } from 'utils/format';

const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getLocationName = state => state.locationName || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config.sentence || null;

export const parsePayload = payload => {
  if (payload) {
    const { source, target, key } = payload;
    return {
      updateLayer: true,
      source,
      target,
      key
    };
  }
  return {};
};

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

    // SANKEY NODES
    const startNodes = orderBy(
      Object.entries(groupBy(data, `from_class_${source}`)).map(
        ([key, group]) => ({
          name: categories[key] ? categories[key] : 'Other',
          key: `${key}-start`,
          color: categories[key]
            ? colors.categories[categories[key]]
            : colors.categories.Other,
          value: sumBy(group, 'area')
        })
      ),
      'value',
      'desc'
    );
    const nodes = [
      ...startNodes,
      ...startNodes.map(n => ({ ...n, key: n.key.replace('start', 'end') }))
    ];

    // SANKEY LINKS
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
    const biggestLink = maxBy(links, 'value');
    const selectedElement = {
      ...biggestLink,
      source: nodes[biggestLink.source],
      target: nodes[biggestLink.target]
    };

    return { nodes, links, selectedElement };
  }
);

export const parseSentence = createSelector(
  [parseData, getLocationName, getSettings, getSentences],
  (data, locationName, settings, sentence) => {
    if (isEmpty(data)) return null;

    const getNodeName = index =>
      (data.nodes && data.nodes[index] && data.nodes[index].name) || '';
    // sentence has to avoid same category 'changes', even if that option is the active one (no filtering)
    const max =
      data.links &&
      maxBy(
        data.links.filter(d => getNodeName(d.source) !== getNodeName(d.target)),
        'value'
      );
    const { startYear, endYear } = settings;

    const params = {
      startYear,
      endYear,
      firstCategory: getNodeName(max.source),
      secondCategory: getNodeName(max.target),
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
  sentence: parseSentence
});
