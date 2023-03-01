import { getTreeCoverDensity } from 'services/analysis-cached';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_GAIN_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_GAIN,
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'treeCoverDensity',
  title: 'Tree cover density in {location}',
  categories: ['summary', 'land-cover'],
  types: ['global', 'country', 'wdpa', 'aoi'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  caution: {
    text:
      'The methods behind this data have changed over time. Be cautious comparing old and new data, especially before/after 2015. {Read more here}.',
    visible: ['global', 'country', 'geostore', 'aoi', 'wdpa', 'use'],
    linkText: 'Read more here',
    link:
      'https://www.globalforestwatch.org/blog/data-and-research/tree-cover-loss-satellite-data-trend-analysis/',
  },
  large: true,
  visible: ['dashboard', 'analysis'],
  chartType: 'composedChart',
  colors: 'loss',
  settingsConfig: [
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true,
    },
    {
      key: 'years',
      label: 'years',
      endKey: 'endYear',
      startKey: 'startYear',
      type: 'range-select',
      border: true,
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density',
    },
  ],
  pendingKeys: ['threshold', 'years'],
  refetchKeys: ['landCategory', 'threshold'],
  dataType: 'gain',
  metaKey: 'widget_primary_forest_loss',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    // gain
    {
      dataset: FOREST_GAIN_DATASET,
      layers: [FOREST_GAIN],
    },
  ],
  sortOrder: {
    summary: -1,
    forestChange: -1,
  },
  sentence: {
    initial: '{location} had an average tree cover of {percent} in 2020',
  },
  whitelists: {
    indicators: ['primary_forest'],
    checkStatus: true,
  },
  getData: (params = {}) => {
    const treeCoverDensity = getTreeCoverDensity(params);

    return treeCoverDensity.then((data) => data);
  },
  getDataURL: (params) => {
    const treeCoverDensity = getTreeCoverDensity(params);

    return treeCoverDensity.then((data) => data);
  },
  getWidgetProps,
};
