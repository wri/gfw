import { getTreeCoverGainByPlantationType } from 'services/analysis-cached';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_GAIN_DATASET,
  TREE_PLANTATIONS_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_GAIN,
  TREE_PLANTATIONS,
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'treeCoverGainOutsidePlantations',
  title: {
    global: 'Tree cover gain outside plantations globally',
    region: 'Tree cover gain outside plantations in {location}',
  },
  categories: ['forest-change'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      whitelist: ['ifl', 'primary_forest'],
      type: 'select',
      placeholder: 'All tree cover',
      clearable: true,
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      blacklist: ['wdpa'],
    },
  ],
  refetchKeys: ['forestType', 'landCategory'],
  chartType: 'pieChart',
  colors: 'gainWithinOutsidePlantations',
  metaKey: 'gfw_planted_forests',
  dataType: 'gain',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    {
      dataset: FOREST_GAIN_DATASET,
      layers: [FOREST_GAIN],
    },
    {
      dataset: TREE_PLANTATIONS_DATASET,
      layers: [TREE_PLANTATIONS],
    },
  ],
  visible: ['dashboard'],
  sortOrder: {
    forestChange: 8,
  },
  sentences: {
    global:
      'Globally between 2001 and 2020, {gainPercent} of tree cover gain occurred outside of plantations.',
    region:
      'In {location} between 2001 and 2020, {gainPercent} of tree cover gain occurred outside of plantations.',
  },
  settings: {
    threshold: 0,
  },
  getData: (params) => {
    return getTreeCoverGainByPlantationType(params).then((response) => {
      const { data } = (response && response.data) || {};

      const totalArea = data.reduce(
        (prev, curr) => prev + curr?.gain_area_ha,
        0
      );
      const areaOutsidePlantations = data.find(
        (row) => row.plantation_type === 'Outside of Plantations'
      )?.gain_area_ha;

      const areaWithinPlantations = totalArea - areaOutsidePlantations;

      return { totalArea, areaOutsidePlantations, areaWithinPlantations };
    });
  },
  getDataURL: (params) => {
    return [getTreeCoverGainByPlantationType({ ...params, download: true })];
  },
  getWidgetProps,
};
