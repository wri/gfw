import { getNaturalForest } from 'services/analysis-cached';
import { NATURAL_FOREST, POLITICAL_BOUNDARIES_DATASET } from 'data/datasets';
import {
  NATURAL_FOREST_2020,
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'naturalForest',
  title: {
    default: 'Natural forest in {location}',
    global: 'Global natural forest',
  },
  sentence: {
    default: {
      global: `As of 2020, {naturalForestPercentage} of <b>global</b> land cover was natural forests and {nonNaturalForestPercentage} was non-natural tree cover.`,
      region: `As of 2020, {naturalForestPercentage} of land cover in {location} was natural forests and {nonNaturalForestPercentage} was non-natural tree cover.`,
    },
    withIndicator: {
      global: `As of 2020, {naturalForestPercentage} of <b>global</b> land cover in {indicator} was natural forests and {nonNaturalForestPercentage} was non-natural tree cover.`,
      region: `As of 2020, {naturalForestPercentage} of land cover in {indicator} in {location} was natural forests and {nonNaturalForestPercentage} was non-natural tree cover.`,
    },
  },
  metaKey: {
    2000: 'sbtn_natural_forests_map',
    2010: 'sbtn_natural_forests_map',
    2020: 'sbtn_natural_forests_map',
  },
  chartType: 'pieChart',
  large: false,
  colors: 'extent',
  source: 'gadm',
  categories: ['land-cover', 'summary'],
  // NOTE: this `types` array dictates where do we want to show the widget in the map (i.e.: "only for countries but not for custom areas")
  // see components/analysis/components/show-analysis/component.jsx filteredData since I had to do a workaround because it was showing a label we don't want to
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  visible: ['dashboard', 'analysis'],
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    {
      dataset: NATURAL_FOREST,
      layers: [NATURAL_FOREST_2020],
    },
  ],
  dataType: 'naturalForest',
  sortOrder: {
    summary: 6,
    landCover: 1,
  },
  refetchKeys: ['threshold', 'decile', 'extentYear', 'landCategory'],
  pendingKeys: ['threshold', 'decile', 'extentYear'],
  settings: {
    extentYear: 2000,
  },
  getSettingsConfig: () => {
    return [
      {
        key: 'landCategory',
        label: 'Land Category',
        type: 'select',
        placeholder: 'All categories',
        clearable: true,
        border: true,
      },
    ];
  },
  getData: (params) => {
    const { threshold, decile, ...filteredParams } = params;

    return getNaturalForest({ ...filteredParams }).then((response) => {
      const extent = response.data;

      let totalNaturalForest = 0;
      let totalNonNaturalTreeCover = 0;
      let unknown = 0;

      let data = {};
      if (extent && extent.length) {
        // Sum values
        extent.forEach((item) => {
          switch (item.sbtn_natural_forests__class) {
            case 'Natural Forest':
              totalNaturalForest += item.area__ha;
              break;
            case 'Non-Natural Forest':
              totalNonNaturalTreeCover += item.area__ha;
              break;
            default:
              // 'Unknown'
              unknown += item.area__ha;
          }
        });

        data = {
          totalNaturalForest,
          unknown,
          totalNonNaturalTreeCover,
          totalArea: totalNaturalForest + unknown + totalNonNaturalTreeCover,
        };
      }

      return data;
    });
  },
  getDataURL: async (params) => {
    const response = await getNaturalForest({ ...params, download: true });

    return [response];
  },
  getWidgetProps,
};
