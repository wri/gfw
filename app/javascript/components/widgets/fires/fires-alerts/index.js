import { all, spread } from 'axios';
import moment from 'moment';
import uniq from 'lodash/uniq';

import { fetchVIIRSAlerts, fetchVIIRSLatest } from 'services/analysis-cached';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FIRES_VIIRS_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FIRES_ALERTS_VIIRS
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'firesAlerts',
  title: 'Weekly Fire Alerts in {location}',
  large: true,
  categories: ['summary', 'fires'],
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
      key: 'dataset',
      label: 'fires dataset',
      type: 'select'
    },
    {
      key: 'compareYear',
      label: 'Compare with the same period in',
      type: 'compare-select',
      placeholder: 'None',
      clearable: true,
      border: true
    },
    {
      key: 'confidence',
      label: 'Confidence level',
      type: 'select',
      clearable: false
    }
  ],
  refetchKeys: ['dataset', 'forestType', 'landCategory', 'confidence'],
  preventRenderKeys: ['startIndex', 'endIndex'],
  visible: ['dashboard'],
  types: ['country', 'wdpa', 'geostore', 'use'],
  admins: ['adm0', 'adm1', 'adm2'],
  chartType: 'composedChart',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    // fires
    {
      dataset: FIRES_VIIRS_DATASET,
      layers: [FIRES_ALERTS_VIIRS]
    }
  ],
  hideLayers: true,
  dataType: 'fires',
  colors: 'fires',
  metaKey: 'widget_fire_alert_location',
  sortOrder: {
    summary: 100,
    fires: 2
  },
  settings: {
    dataset: 'viirs',
    confidence: 'h'
  },
  sentences: {
    allAlerts:
      'In {location} the peak fire season typically begins in {fires_season_start} and lasts around {fire_season_length} weeks. There were {count} {dataset} fire alerts reported between {start_date} and {end_date}. This is {status} compared to previous years going back to {dataset_start_year}.',
    highConfidence:
      'In {location} the peak fire season typically begins in {fires_season_start} and lasts around {fire_season_length} weeks. There were {count} {dataset} fire alerts reported between {start_date} and {end_date} considering <b>high confidence alerts</b> only. This is {status} compared to previous years going back to {dataset_start_year}.',
    allAlertsWithInd:
      'In {location} the peak fire season typically begins in {fires_season_start} and lasts around {fire_season_length} weeks. There were {count} {dataset} fire alerts reported within {indicator} between {start_date} and {end_date}. This is {status} compared to previous years going back to {dataset_start_year}.',
    highConfidenceWithInd:
      'In {location} the peak fire season typically begins in {fires_season_start} and lasts around {fire_season_length} weeks. There were {count} {dataset} fire alerts reported within {indicator} between {start_date} and {end_date} considering <b>high confidence alerts</b> only. This is {status} compared to previous years going back to {dataset_start_year}.'
  },
  whitelistType: 'fires',
  whitelists: {
    adm0: [
      'AFG',
      'AGO',
      'ALB',
      'AND',
      'ANT',
      'ARE',
      'ARG',
      'ARM',
      'AUS',
      'AUT',
      'AZE',
      'BDI',
      'BEL',
      'BEN',
      'BFA',
      'BGD',
      'BGR',
      'BHR',
      'BHS',
      'BIH',
      'BLM',
      'BLR',
      'BLZ',
      'BOL',
      'BRA',
      'BRB',
      'BRN',
      'BTN',
      'BWA',
      'CAF',
      'CAN',
      'CHE',
      'CHL',
      'CHN',
      'CIV',
      'CMR',
      'COD',
      'COG',
      'COL',
      'COM',
      'CPV',
      'CRI',
      'CUB',
      'CYP',
      'CZE',
      'DEU',
      'DJI',
      'DMA',
      'DNK',
      'DOM',
      'DZA',
      'ECU',
      'EGY',
      'ERI',
      'ESP',
      'EST',
      'ETH',
      'FIN',
      'FJI',
      'FLK',
      'FRA',
      'FSM',
      'GAB',
      'GBR',
      'GEO',
      'GHA',
      'GIB',
      'GIN',
      'GLP',
      'GMB',
      'GNB',
      'GNQ',
      'GRC',
      'GRL',
      'GTM',
      'GUF',
      'GUM',
      'GUY',
      'HND',
      'HRV',
      'HTI',
      'HUN',
      'IDN',
      'IND',
      'IRL',
      'IRN',
      'IRQ',
      'ISR',
      'ITA',
      'JAM',
      'JOR',
      'JPN',
      'KAZ',
      'KEN',
      'KGZ',
      'KHM',
      'KIR',
      'KNA',
      'KOR',
      'KWT',
      'LAO',
      'LBN',
      'LBR',
      'LBY',
      'LCA',
      'LIE',
      'LKA',
      'LSO',
      'LTU',
      'LUX',
      'LVA',
      'MAR',
      'MCO',
      'MDA',
      'MDG',
      'MDV',
      'MEX',
      'MHL',
      'MKD',
      'MLI',
      'MLT',
      'MMR',
      'MNE',
      'MNG',
      'MNP',
      'MOZ',
      'MRT',
      'MSR',
      'MTQ',
      'MUS',
      'MWI',
      'MYS',
      'NAM',
      'NCL',
      'NER',
      'NGA',
      'NIC',
      'NLD',
      'NOR',
      'NPL',
      'NZL',
      'OMN',
      'PAK',
      'PAN',
      'PCN',
      'PER',
      'PHL',
      'PNG',
      'POL',
      'PRI',
      'PRK',
      'PRT',
      'PRY',
      'PSE',
      'PYF',
      'QAT',
      'REU',
      'ROU',
      'RUS',
      'RWA',
      'SAU',
      'SDN',
      'SEN',
      'SGP',
      'SLB',
      'SLE',
      'SLV',
      'SOM',
      'SRB',
      'SSD',
      'STP',
      'SUR',
      'SVK',
      'SVN',
      'SWE',
      'SWZ',
      'SYR',
      'TCD',
      'TGO',
      'THA',
      'TJK',
      'TKL',
      'TKM',
      'TLS',
      'TON',
      'TTO',
      'TUN',
      'TUR',
      'TUV',
      'TZA',
      'UGA',
      'UKR',
      'URY',
      'USA',
      'UZB',
      'VAT',
      'VEN',
      'VIR',
      'VNM',
      'VUT',
      'WSM',
      'YEM',
      'ZAF',
      'ZMB',
      'ZWE'
    ]
  },
  getData: params =>
    all([fetchVIIRSAlerts(params), fetchVIIRSLatest(params)]).then(
      spread((alerts, latest) => {
        const { data } = alerts.data;
        const years = uniq(data.map(d => d.year));
        const maxYear = Math.max(...years);
        const latestDate = latest.attributes && latest.attributes.updatedAt;

        return (
          {
            alerts: data,
            latest: latestDate,
            options: {
              compareYear: years.filter(y => y !== maxYear).map(y => ({
                label: y,
                value: y
              }))
            }
          } || {}
        );
      })
    ),
  getDataURL: params => [fetchVIIRSAlerts({ ...params, download: true })],
  getWidgetProps
};
