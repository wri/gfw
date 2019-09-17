import { getExtentGrouped } from 'services/forest-data';

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
  options: {
    units: ['ha', '%'],
    forestTypes: true,
    landCategories: true,
    thresholds: true,
    extentYears: true
  },
  chartType: 'rankedList',
  colors: 'extent',
  metaKey: 'widget_forest_location',
  datasets: [
    // tree cover
    {
      dataset: '044f4af8-be72-4999-b7dd-13434fc4a394',
      layers: {
        2010: '78747ea1-34a9-4aa7-b099-bdb8948200f4',
        2000: 'c05c32fd-289c-4b20-8d73-dc2458234e04'
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
    unit: '%',
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
  getWidgetProps
};
