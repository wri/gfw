import { fetchAnalysisEndpoint } from 'services/analysis';

import { getGain } from 'services/analysis-cached';

import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_GAIN_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_GAIN
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'treeCoverGainSimple',
  title: 'Tree cover gain in {location}',
  categories: ['summary', 'forest-change'],
  types: ['geostore', 'wdpa', 'use'],
  admins: ['adm0', 'adm1'],
  metaKey: 'widget_tree_cover_gain',
  settingsConfig: [
    {
      key: 'extentYear',
      label: 'extent year',
      type: 'switch'
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  pendingKeys: ['threshold', 'extentYear'],
  refetchKeys: ['threshold', 'extentYear'],
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    // gain
    {
      dataset: FOREST_GAIN_DATASET,
      layers: [FOREST_GAIN]
    }
  ],
  visible: ['dashboard', 'analysis'],
  sortOrder: {
    summary: 3,
    forestChange: 7
  },
  settings: {
    threshold: 30,
    extentYear: 2000
  },
  chartType: 'listLegend',
  colors: 'gain',
  sentence:
    'From 2001 to 2012, {location} gained {gain} of tree cover equal to {gainPercent} is its total extent.',
  getData: params => {
    if (shouldQueryPrecomputedTables(params)) {
      return getGain(params).then(response => {
        const { data } = (response && response.data) || {};
        const gain = (data[0] && data[0].gain) || 0;
        const extent = (data[0] && data[0].extent) || 0;

        return {
          gain,
          extent
        };
      });
    }

    return fetchAnalysisEndpoint({
      ...params,
      name: 'umd',
      params,
      slug: 'umd-loss-gain',
      version: 'v1',
      aggregate: false
    }).then(response => {
      const { data } = (response && response.data) || {};
      const gain = data && data.attributes.gain;
      const extent =
        data &&
        data.attributes[`treeExtent${params.extentYear === 2010 ? 2010 : ''}`];

      return {
        gain,
        extent
      };
    });
  },
  getWidgetProps
};
