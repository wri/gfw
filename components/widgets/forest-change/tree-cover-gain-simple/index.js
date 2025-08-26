import { all } from 'axios';

import {
  getGain,
  getTreeCoverGainOTF,
  getExtent,
} from 'services/analysis-cached';

import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';

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

const MIN_YEAR = 2000;

export default {
  widget: 'treeCoverGainSimple',
  title: 'Tree cover gain in {location}',
  categories: ['summary', 'forest-change'],
  subcategories: ['forest-gain'],
  types: ['geostore', 'aoi', 'wdpa', 'use'],
  admins: ['adm0', 'adm1'],
  metaKey: 'umd_tree_cover_gain_from_height',
  dataType: 'gain',
  pendingKeys: ['threshold'],
  refetchKeys: ['threshold', 'startYear'],
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
  visible: ['dashboard', 'analysis'],
  sortOrder: {
    summary: 3,
    forestChange: 7,
  },
  settings: {
    threshold: 30,
    extentYear: 2000,
    startYear: MIN_YEAR,
    endYear: 2020, // reference to display the correct data on the map
  },
  chartType: 'listLegend',
  colors: 'gain',
  sentence:
    'From {baselineYear} to 2020, {location} gained {gain} of tree cover equal to {gainPercent} increase from baseline 2000 tree cover.',
  settingsConfig: [
    {
      key: 'baselineYear',
      label: 'Baseline Year',
      type: 'baseline-select',
      startKey: 'startYear',
      placeholder: MIN_YEAR,
      clearable: true,
    },
  ],
  getData: (params) => {
    if (shouldQueryPrecomputedTables(params)) {
      return all([getGain(params), getExtent(params)]).then((response) => {
        const gain = (response[0] && response[0].data.data[0].gain) || 0;
        const extent = (response[1] && response[1].data.data[0].extent) || 0;

        return {
          gain,
          extent,
        };
      });
    }

    return getTreeCoverGainOTF(params);
  },
  getDataURL: (params) => [
    getGain({ ...params, download: true }),
    getExtent({ ...params, download: true }),
  ],
  getWidgetProps,
};
