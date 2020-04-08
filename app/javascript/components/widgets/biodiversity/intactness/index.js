import request from 'utils/request';

import {
  POLITICAL_BOUNDARIES_DATASET,
  BIODIVERSITY_SIGNIFICANCE_2016_DATASET,
  BIODIVERSITY_INTACTNESS_2016_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  BIODIVERSITY_INTACTNESS,
  BIODIVERSITY_SIGNIFICANCE
} from 'data/layers';

import { getWidgetProps } from './selectors';

export default {
  widget: 'intactness',
  title: 'Biodiversity Status',
  categories: ['biodiversity'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1'],
  large: true,
  analysis: false,
  options: {
    bioTypes: true
  },
  colors: 'biodiversity',
  dataType: 'biodiversity',
  metaKey: 'biodiversity_intactness',
  layers: [BIODIVERSITY_INTACTNESS, BIODIVERSITY_SIGNIFICANCE],
  chartType: 'chartAndList',
  sortOrder: {
    summary: 0,
    forestChange: 0
  },
  sentence: {
    initial:
      'Around {percent} of {location} has a {percentile} degree of biodiversity {variable}.'
  },
  settings: {
    bType: 'int',
    page: 0,
    pageSize: 6,
    percentile: null
  },
  settingsConfig: [
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      whitelist: ['kba', 'aze', 'tiger_cl', 'wdpa'],
      placeholder: 'All categories',
      border: true
    },
    {
      key: 'weeks',
      label: 'weeks',
      type: 'select',
      whitelist: [13, 26, 52],
      noSort: true
    },
    {
      key: 'extentYear',
      label: 'extent year',
      type: 'switch'
    },
    {
      key: 'unit',
      label: 'unit',
      whitelist: ['%', 'ha'],
      type: 'switch'
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    {
      dataset: BIODIVERSITY_SIGNIFICANCE_2016_DATASET,
      layers: [BIODIVERSITY_SIGNIFICANCE]
    },
    {
      dataset: BIODIVERSITY_INTACTNESS_2016_DATASET,
      layers: [BIODIVERSITY_INTACTNESS]
    }
  ],
  getData: params => {
    const { adm0, adm1 } = params;
    let sql;

    if (!adm0 && !adm1) {
      sql = `SELECT iso AS location, sum(area) as area,
  sum(significance_total) AS sig, sum(intactness_total) AS int
  FROM global_biodiversity_table
  GROUP BY iso`;
    } else if (adm0 && !adm1) {
      sql = `SELECT iso, adm1 AS location, sum(area) as area,
  sum(significance_total) AS sig, sum(intactness_total) AS int
  FROM global_biodiversity_table
  WHERE iso = '${adm0}'
  GROUP BY iso, adm1`;
    } else if (adm0 && adm1) {
      sql = `SELECT iso, adm1, adm2 AS location, sum(area) as area,
  sum(significance_total) AS sig, sum(intactness_total) AS int
  FROM global_biodiversity_table
  WHERE iso = '${adm0}'
  AND adm1 = '${adm1}'
  GROUP BY iso, adm1, adm2`;
    }

    return request
      .get(`${process.env.CARTO_API}/sql`, { params: { q: sql } })
      .then(response => response.data.rows);
  },
  getWidgetProps
};
