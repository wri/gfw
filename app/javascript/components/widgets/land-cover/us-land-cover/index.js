import { getUSLandCover } from 'services/forest-data';
import { USA_LAND_COVER_DATASET } from 'data/layers-datasets';
import {
  USA_LAND_COVER_2001,
  USA_LAND_COVER_2006,
  USA_LAND_COVER_2011,
  USA_LAND_COVER_2016
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'national-land-cover-database',
  title: 'Land cover change in {location}',
  large: true,
  categories: ['land-cover'],
  types: ['country'],
  admins: ['adm0', 'adm1', 'adm2'],
  metaKey: 'usa_land_cover',
  colors: 'plantations',
  chartType: 'sankey',
  dataType: 'nlcd_landcover',
  layers: ['plantations_by_type', 'plantations_by_species'],
  refetchKeys: ['source', 'startYear', 'endYear'],
  datasets: [
    {
      dataset: USA_LAND_COVER_DATASET,
      layers: {
        2001: USA_LAND_COVER_2001,
        2006: USA_LAND_COVER_2006,
        2011: USA_LAND_COVER_2011,
        2016: USA_LAND_COVER_2016
      }
    }
  ],
  settingsConfig: [
    {
      key: 'source',
      label: 'source',
      type: 'select',
      whitelist: ['ipcc', 'nlcd']
    },
    {
      key: 'variable',
      label: 'variable',
      type: 'select',
      whitelist: ['changes_only', 'all_data'],
      border: true
    },
    {
      key: 'years',
      label: 'years',
      endKey: 'endYear',
      startKey: 'startYear',
      type: 'range-select',
      options: [2001, 2006, 2011, 2016].map(y => ({ label: y, value: y }))
    }
  ],
  sortOrder: {
    landCover: 101
  },
  settings: {
    startYear: 2001,
    endYear: 2016,
    variable: 'changes_only',
    unit: 'ha',
    source: 'ipcc'
  },
  sentences: {
    initial: `From {startYear} to {endYear}, the highest land cover change was found in areas converted from {firstCategory} to
    {secondCategory}, equivalent to {amount}, which represents {percentage} of all land cover.`,
    interaction: `From {startYear} to {endYear}, land cover changing from {firstCategory} to {secondCategory}, was equivalent to {amount}, which
    represents {percentage} of all land cover.`,
    noChange:
      'From {startYear} to {endYear}, most land cover remained {firstCategory}, equivalent to {amount}, which represents {percentage} of all land cover.'
  },
  whitelists: {
    adm0: ['USA']
  },
  blacklists: {
    adm1: [2, 12]
  },
  getData: params =>
    getUSLandCover(params).then(response => {
      const data = response.data.rows;
      return data;
    }),
  showDownloadButton: true,
  getDataURL: params => [getUSLandCover({ ...params, download: true })],
  getWidgetProps,
  parseInteraction: payload => {
    if (payload) {
      const { source, target, key } = payload;
      return {
        updateLayer: true,
        source,
        target,
        key
      };
    }
    return {};
  }
};
