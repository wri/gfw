import { getNaturalForest } from 'services/analysis-cached';
import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_EXTENT_DATASET,
  TROPICAL_TREE_COVER_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_EXTENT,
  TREE_COVER,
  TROPICAL_TREE_COVER_METERS,
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
      global: `As of 2020, {naturalForestPercentage} of global land cover was natural forests and {nonNaturalForestPercentage} was non-natural tree cover.`,
      region: `As of 2020, {naturalForestPercentage} of land cover in {area} was natural forests and {nonNaturalForestPercentage} was non-natural tree cover.`,
    },
  },
  metaKey: {
    2000: 'widget_tree_cover',
    2010: 'widget_tree_cover',
    2020: 'wri_trees_in_mosaic_landscapes',
  },
  chartType: 'pieChart',
  large: false,
  colors: 'extent',
  source: 'gadm',
  categories: ['land-cover', 'summary'],
  types: ['global', 'country', 'geostore', 'aoi', 'wdpa', 'use'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  visible: ['dashboard'],
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    {
      dataset: {
        2020: TROPICAL_TREE_COVER_DATASET,
        2010: FOREST_EXTENT_DATASET,
        2000: FOREST_EXTENT_DATASET,
      },
      layers: {
        2020: TROPICAL_TREE_COVER_METERS,
        2010: FOREST_EXTENT,
        2000: TREE_COVER,
      },
    },
  ],
  sortOrder: {
    summary: 6,
    landCover: 1,
  },
  refetchKeys: ['threshold', 'decile', 'extentYear', 'landCategory'],
  pendingKeys: ['threshold', 'decile', 'extentYear'],
  settings: {
    threshold: 30,
    decile: 30,
    extentYear: 2000,
  },
  getDataType: (params) => {
    const { extentYear } = params;
    const isTropicalTreeCover = extentYear === 2020;
    return isTropicalTreeCover ? 'tropicalExtent' : 'extent';
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
  getDataURL: (params) => {
    const { threshold, decile, ...filteredParams } = params;
    const { extentYear } = filteredParams;
    const isTropicalTreeCover = !(extentYear === 2000 || extentYear === 2010);
    const decileThreshold = isTropicalTreeCover ? { decile } : { threshold };
    const commonParams = {
      ...filteredParams,
      ...decileThreshold,
      download: true,
    };

    const downloadArray = [
      getNaturalForest({
        ...commonParams,
        forestType: null,
        landCategory: null,
      }),
    ];

    return downloadArray;
  },
  getWidgetProps,
};
