import { getUSLandCover } from 'services/forest-data';

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
      dataset: 'd95bcd10-bdaf-4787-83a8-f8293af1c2f4',
      layers: {
        2001: '49a4801f-4c23-435a-9f8c-e7543bd875fc',
        2006: 'a12a37fa-06a0-4437-957e-f01675d0c4bd',
        2011: '3d829585-970b-47ce-b33d-6c218eea543e',
        2016: 'a7058917-006e-4742-bdfc-6e372812eb0e'
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
  getDownloadLink: ({ adm0, adm1, adm2, settings } = {}) =>
    getUSLandCover({ adm0, adm1, adm2, ...settings, download: true }),
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
