import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';
import maxBy from 'lodash/maxBy';
import sumBy from 'lodash/sumBy';
import orderBy from 'lodash/orderBy';
import findIndex from 'lodash/findIndex';

import { formatNumber } from 'utils/format';

const getData = state => state.data;
const getSettings = state => state.settings;
const getColors = state => state.colors;
const getSentences = state => state.sentences;

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
    if (!source) source = 'ipcc';
    const categories = {
      ipcc: {
        forest_land: 'Forest',
        bare: 'Bare',
        settlement: 'Settlement',
        cropland: 'Agriculture',
        grassland: 'Grassland',
        wetland: 'Wetland'
      },
      nlcd: {
        deciduous_forest: 'Deciduous forest',
        evergreen_forest: 'Evergreen forest',
        mixed_forest: 'Mixed forest',
        shrub_scrub: 'Shrub/scrub',
        grass_herb: 'Grassland/herbaceous',
        cultivated_crops: 'Cultivated crops',
        pasture_hay: 'Pasture/hay',
        developed_open_space: 'Developed open space',
        developed_low_intensity: 'Developed low intensity',
        developed_medium_intensity: 'Developed medium intensity',
        developed_high_intensity: 'Developed high intensity',
        woody_wetlands: 'Woody wetlands',
        emergent_herbaceous_wetlands: 'Emergent herbaceous wetlands',
        barren: 'Barren land (rock/sand/clay)',
        perennial_ice_snow: 'Perennial ice/snow',
        open_water: 'Water Body'
      }
    };

    // SANKEY NODES
    const startNodes = orderBy(
      Object.entries(groupBy(data, `from_class_${source}`)).map(
        ([key, group]) => ({
          name: categories[source][key] ? categories[source][key] : 'Other',
          key: `${key}-start`,
          color: categories[source][key]
            ? colors.categories[categories[source][key]]
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
      name: categories[source][key] ? categories[source][key] : 'Other',
      key: `${key}-end`,
      color: categories[source][key]
        ? colors.categories[categories[source][key]]
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

export const parseDataConfig = createSelector(
  [parseData, getSettings],
  (data, settings) => {
    if (isEmpty(data)) return null;
    const { nodes } = data;
    const { source } = settings;
    const threshold = 3;
    const topNNodes = [
      ...nodes.filter(n => n.key.includes('start')).slice(0, threshold),
      ...nodes.filter(n => n.key.includes('end')).slice(0, threshold)
    ];
    const shouldShowLabel = node => {
      if (source === 'nlcd') {
        return findIndex(topNNodes, { key: node.key }) >= 0;
      }
      return true;
    };
    return { shouldShowLabel };
  }
);

export const parseSentence = createSelector(
  [getData, parseData, getSettings, getSentences],
  (rawdata, data, settings, sentences) => {
    if (isEmpty(data)) return null;
    const { startYear, endYear, interaction } = settings;
    const { initial, interaction: interactionSentence, noChange } = sentences;
    const { nodes, links, selectedElement } = data;

    let firstCategory;
    let secondCategory;
    let amount;
    let percentage;

    const total = sumBy(rawdata, 'area');

    if (isEmpty(interaction)) {
      // nothing selected, init sentence
      firstCategory = selectedElement.source && selectedElement.source.name;
      secondCategory = selectedElement.target && selectedElement.target.name;
      amount = formatNumber({ num: selectedElement.value, unit: 'ha' });
      percentage = formatNumber({
        num: selectedElement.value / total * 100,
        unit: '%'
      });
    } else if (interaction.source && interaction.target) {
      // link selected
      const link = links.find(l => l.key === interaction.key);
      firstCategory = interaction.source.name;
      secondCategory = interaction.target.name;
      const change = link && link.value;
      amount = formatNumber({ num: change, unit: 'ha' });
      percentage = formatNumber({ num: change / total * 100, unit: '%' });
    } else if (interaction.key && interaction.key.includes('start')) {
      // start node
      const sourceNode = nodes.find(n => n.key === interaction.key);
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
    } else if (interaction.key && interaction.key.includes('end')) {
      // end node
      const endNode = nodes.find(n => n.key === interaction.key);
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

    let sentence = isEmpty(interaction) ? initial : interactionSentence;
    if (firstCategory === secondCategory) sentence = noChange;
    return {
      sentence,
      params
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  config: parseDataConfig,
  sentence: parseSentence
});
