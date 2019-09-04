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
const getColors = state => state.colors || null;
const getSentences = state => state.config.sentences || null;

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
    const uniqueEndNodes = Object.entries(
      groupBy(data, `to_class_${source}`)
    ).map(([key, group]) => ({
      name: categories[key] ? categories[key] : 'Other',
      key: `${key}-end`,
      color: categories[key]
        ? colors.categories[categories[key]]
        : colors.categories.Other,
      value: sumBy(group, 'area')
    }));
    const endNodes = [
      // nodes already in startNodes
      ...startNodes
        .map(startNode => ({
          ...startNode,
          key: startNode.key.replace('start', 'end')
        }))
        .filter(
          startNode => findIndex(uniqueEndNodes, { key: startNode.key }) >= 0
        ),
      // 'new' nodes
      ...uniqueEndNodes.filter(
        endNode =>
          findIndex(startNodes, {
            key: endNode.key.replace('end', 'start')
          }) === -1
      )
    ];

    const nodes = [...startNodes, ...endNodes];
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
        key: `${sourceIndex}_${targetIndex}`,
        startKey: d[`from_class_${source}`],
        endKey: d[`to_class_${source}`]
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
  [getData, parseData, getSettings, getSentences],
  (rawdata, data, settings, sentences) => {
    if (isEmpty(data)) return null;
    const { startYear, endYear, activeData } = settings;
    const { initial, interaction } = sentences;
    const { nodes, links, selectedElement } = data;

    let firstCategory;
    let secondCategory;
    let amount;
    let percentage;

    const total = sumBy(rawdata, 'area');

    if (isEmpty(activeData)) {
      // nothing selected, init sentence
      firstCategory = selectedElement.target && selectedElement.target.name;
      secondCategory = selectedElement.source && selectedElement.source.name;
      amount = formatNumber({ num: selectedElement.value, unit: 'ha' });
      percentage = formatNumber({
        num: selectedElement.value / total * 100,
        unit: '%'
      });
    } else if (activeData.source && activeData.target) {
      // link selected
      const link = links.find(l => l.key === activeData.key);
      firstCategory = activeData.source.name;
      secondCategory = activeData.target.name;
      const change = link && link.value;
      amount = formatNumber({ num: change, unit: 'ha' });
      percentage = formatNumber({ num: change / total * 100, unit: '%' });
    } else if (activeData.key && activeData.key.includes('start')) {
      // start node
      const sourceNode = nodes.find(n => n.key === activeData.key);
      firstCategory = sourceNode && sourceNode.name;
      secondCategory = 'other types';
      const change = sumBy(
        links.filter(
          l =>
            `${l.startKey}-start` === sourceNode.key && l.startKey !== l.endKey
        ),
        'value'
      );
      amount = formatNumber({ num: change, unit: 'ha' });
      percentage = formatNumber({ num: change / total * 100, unit: '%' });
    } else if (activeData.key && activeData.key.includes('end')) {
      // end node
      const endNode = nodes.find(n => n.key === activeData.key);
      firstCategory = 'other types';
      secondCategory = endNode && endNode.name;
      const change = sumBy(
        links.filter(
          l => `${l.endKey}-end` === endNode.key && l.startKey !== l.endKey
        ),
        'value'
      );
      amount = formatNumber({ num: change, unit: 'ha' });
      percentage = formatNumber({ num: change / total * 100, unit: '%' });
    }

    const params = {
      startYear,
      endYear,
      firstCategory,
      secondCategory,
      amount,
      percentage
    };
    return {
      sentence: isEmpty(activeData) ? initial : interaction,
      params
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence
});
