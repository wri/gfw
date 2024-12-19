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

const MIN_YEAR = 2000;

export default {
  widget: 'treeCoverGainOutsidePlantations',
  title: {
    global: 'Tree cover gain outside plantations globally',
    region: 'Tree cover gain outside plantations in {location}',
  },
  categories: ['forest-change'],
  subcategories: ['forest-gain'],
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
    {
      key: 'baselineYear',
      label: 'Baseline Year',
      type: 'baseline-select',
      startKey: 'startYear',
      placeholder: MIN_YEAR,
      clearable: true,
    },
  ],
  refetchKeys: ['forestType', 'landCategory', 'startYear'],
  chartType: 'pieChart',
  colors: 'gainWithinOutsidePlantations',
  metaKey: 'widget_tree_cover_gain_outside_plantations',
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
    globalInitial:
      'Globally between {baselineYear} and 2020, {gainPercent} of tree cover gain occurred outside of plantations.',
    globalWithIndicator:
      'Globally between {baselineYear} and 2020, {gainPercent} of tree cover gain within {indicator} occurred outside of plantations.',
    regionInitial:
      'In {location} between {baselineYear} and 2020, {gainPercent} of tree cover gain occurred outside of plantations.',
    regionWithIndicator:
      'In {location} between {baselineYear} and 2020, {gainPercent} of tree cover gain within {indicator} occurred outside of plantations. ',
  },
  settings: {
    threshold: 0,
    startYear: MIN_YEAR,
    endYear: 2020, // reference to display the correct data on the map
  },
  getData: (params) => {
    return getTreeCoverGainByPlantationType(params).then((response) => {
      const { data } = (response && response.data) || {};

      if (data?.length === 0) return null;

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
