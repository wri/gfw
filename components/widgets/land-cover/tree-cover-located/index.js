import { getExtentGrouped } from 'services/analysis-cached';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_EXTENT_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_EXTENT,
  TREE_COVER
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'treeCoverLocated',
  title: {
    global: 'Global Location of forest',
    initial: 'Location of forest in {location}'
  },
  categories: ['summary', 'land-cover'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1'],
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      type: 'select',
      placeholder: 'All tree cover',
      clearable: true
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true
    },
    {
      key: 'unit',
      label: 'unit',
      type: 'switch',
      whitelist: ['ha', '%']
    },
    {
      key: 'extentYear',
      label: 'extent year',
      type: 'switch',
      border: true
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  refetchKeys: ['extentYear', 'forestType', 'landCategory', 'threshold'],
  chartType: 'rankedList',
  colors: 'extent',
  metaKey: 'widget_forest_location',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    // tree cover
    {
      dataset: FOREST_EXTENT_DATASET,
      layers: {
        2010: FOREST_EXTENT,
        2000: TREE_COVER
      }
    }
  ],
  sortOrder: {
    summary: 5,
    landCover: 2
  },
  settings: {
    threshold: 30,
    extentYear: 2010,
    unit: 'ha',
    pageSize: 5,
    page: 0,
    ifl: 2000
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
    noCover: 'No tree cover was identified in {location}.'
  },
  data: [
    {
      data: 'extent',
      threshold: 'current',
      indicator: 'gadm28'
    },
    {
      data: 'extent',
      threshold: 'current',
      indicator: 'current'
    }
  ],
  getData: params =>
    getExtentGrouped(params).then(response => {
      const { data } = response.data;
      let mappedData = {};
      if (data && data.length) {
        let groupKey = 'iso';
        if (params.adm0) groupKey = 'adm1';
        if (params.adm1) groupKey = 'adm2';

        mappedData = data.map(d => ({
          id: parseInt(d[groupKey], 10),
          extent: d.extent || 0,
          percentage: d.extent ? d.extent / d.total_area * 100 : 0
        }));
        if (!params.type || params.type === 'global') {
          mappedData = data.map(d => ({
            id: d.iso,
            extent: d.extent || 0,
            percentage: d.extent ? d.extent / d.total_area * 100 : 0
          }));
        }
      }
      return mappedData;
    }),
  getDataURL: params => [getExtentGrouped({ ...params, download: true })],
  getWidgetProps
};
