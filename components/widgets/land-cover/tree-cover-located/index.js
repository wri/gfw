import {
  getExtentGrouped,
  getTropicalExtentGrouped,
} from 'services/analysis-cached';

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
  TROPICAL_TREE_COVER_HECTARE,
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'treeCoverLocated',
  title: {
    global: 'Global location of tree cover',
    initial: 'Location of tree cover in {location}',
  },
  alerts: [
    {
      id: 'tree-cover-located-alert-1',
      text:
        'Datasets available here (Tree Cover 2000/ 2010 and Tropical Tree Cover 2020) use different methodologies to measure tree cover. Read [our blog](https://www.globalforestwatch.org/blog/data-and-research/tree-cover-data-comparison/) for more information.',
      visible: [
        'global',
        'country',
        'geostore',
        'aoi',
        'wdpa',
        'use',
        'dashboard',
      ],
    },
  ],
  categories: ['summary', 'land-cover'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1'],
  refetchKeys: [
    'extentYear',
    'forestType',
    'landCategory',
    'threshold',
    'decile',
  ],
  chartType: 'rankedList',
  colors: 'extent',

  metaKey: {
    2000: 'widget_tree_cover',
    2010: 'widget_tree_cover',
    2020: 'wri_trees_in_mosaic_landscapes',
  },
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    // tree cover
    {
      dataset: {
        2020: TROPICAL_TREE_COVER_DATASET,
        2010: FOREST_EXTENT_DATASET,
        2000: FOREST_EXTENT_DATASET,
      },
      layers: {
        2020: TROPICAL_TREE_COVER_HECTARE,
        2010: FOREST_EXTENT,
        2000: TREE_COVER,
      },
    },
  ],
  sortOrder: {
    summary: 5,
    landCover: 2,
  },
  settings: {
    threshold: 30,
    decile: 30,
    extentYear: 2010,
    unit: 'ha',
    pageSize: 5,
    page: 0,
    ifl: 2000,
  },
  sentences: {
    globalInitial:
      '{location} as of {year}, the top {count} countries represent {percentage} of all tree cover. {region} had the most tree cover at {value} compared to an average of {average}.',
    globalWithIndicator:
      '{location} as of {year}, the top {count} countries represent {percentage} of {indicator}. {region} had the most tree cover at {value} compared to an average of {average}.',
    globalLandCatOnly:
      '{location} as of {year}, the top {count} countries represent {percentage} of tree cover in {indicator}. {region} had the most tree cover at {value} compared to an average of {average}.',
    initial:
      'In {location} as of {year}, the top {count} regions represent {percentage} of all tree cover. {region} had the most tree cover at {value} compared to an average of {average}.',
    hasIndicator:
      'In {location} as of {year}, the top {count} regions represent {percentage} of {indicator}. {region} had the most tree cover at {value} compared to an average of {average}.',
    landCatOnly:
      '{location} as of {year}, the top {count} regions represent {percentage} of tree cover in {indicator}. {region} had the most tree cover at {value} compared to an average of {average}.',
    percGlobalInitial:
      '{location} as of {year}, the top {count} countries represent {percentage} of all tree cover. {region} had the most relative tree cover at {value} compared to an average of {average}.',
    percGlobalWithIndicator:
      '{location} as of {year}, the top {count} countries represent {percentage} of {indicator}. {region} had the most relative tree cover at {value} compared to an average of {average}.',
    percGlobalLandCatOnly:
      '{location} as of {year}, the top {count} countries represent {percentage} of tree cover in {indicator}. {region} had the most relative tree cover at {value} compared to an average of {average}..',
    percInitial:
      'In {location} as of {year}, the top {count} regions represent {percentage} of all tree cover. {region} had the most relative tree cover at {value} compared to an average of {average}.',
    percHasIndicator:
      'In {location} as of {year}, the top {count} regions represent {percentage} of {indicator}. {region} had the most relative tree cover at {value} compared to an average of {average}.',
    percLandCatOnly:
      'In {location} as of {year}, the top {count} regions represent {percentage} of tree cover in {indicator}. {region} had the most relative tree cover at {value} compared to an average of {average}.',
    noCover: 'No tree cover was identified in {location}.',
  },
  data: [
    {
      data: 'extent',
      threshold: 'current',
      indicator: 'gadm28',
    },
    {
      data: 'extent',
      threshold: 'current',
      indicator: 'current',
    },
  ],
  getDataType: (params) => {
    const { extentYear } = params;
    const isTropicalTreeCover = extentYear === 2020;
    return isTropicalTreeCover ? 'tropicalExtent' : 'extent';
  },
  getSettingsConfig: (params) => {
    const { extentYear } = params;
    const isTropicalTreeCover = extentYear === 2020;

    return [
      {
        key: 'extentYear',
        label: 'Tree cover dataset',
        type: 'select',
        border: true,
      },
      {
        key: 'forestType',
        label: 'Forest Type',
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
        border: true,
      },
      {
        key: 'unit',
        label: 'unit',
        type: 'switch',
        whitelist: ['ha', '%'],
      },
      {
        key: isTropicalTreeCover ? 'decile' : 'threshold',
        label: 'Tree cover',
        type: 'mini-select',
        metaKey: isTropicalTreeCover
          ? 'wri_trees_in_mosaic_landscapes'
          : 'widget_canopy_density',
      },
    ];
  },
  getData: (params) => {
    const { threshold, decile, ...filteredParams } = params;
    const { extentYear } = filteredParams;
    const isTropicalTreeCover = !(extentYear === 2000 || extentYear === 2010);
    const decileThreshold = isTropicalTreeCover ? { decile } : { threshold };
    const extentFn = isTropicalTreeCover
      ? getTropicalExtentGrouped
      : getExtentGrouped;

    return extentFn({
      ...filteredParams,
      ...decileThreshold,
    }).then((response) => {
      const { data } = response.data;
      let mappedData = {};
      if (data && data.length) {
        let groupKey = 'iso';
        if (filteredParams.adm0) groupKey = 'adm1';
        if (filteredParams.adm1) groupKey = 'adm2';

        mappedData = data.map((d) => ({
          id: parseInt(d[groupKey], 10),
          extent: d.extent || 0,
          percentage: d.extent ? (d.extent / d.total_area) * 100 : 0,
        }));
        if (!filteredParams.type || filteredParams.type === 'global') {
          mappedData = data.map((d) => ({
            id: d.iso,
            extent: d.extent || 0,
            percentage: d.extent ? (d.extent / d.total_area) * 100 : 0,
          }));
        }
      }
      return mappedData;
    });
  },
  getDataURL: (params) => {
    const { threshold, decile, ...filteredParams } = params;
    const { extentYear } = filteredParams;
    const isTropicalTreeCover = !(extentYear === 2000 || extentYear === 2010);
    const downloadFn = isTropicalTreeCover
      ? getTropicalExtentGrouped
      : getExtentGrouped;
    const decileThreshold = isTropicalTreeCover ? { decile } : { threshold };

    return [
      downloadFn({ ...filteredParams, ...decileThreshold, download: true }),
    ];
  },
  getWidgetProps,
};
