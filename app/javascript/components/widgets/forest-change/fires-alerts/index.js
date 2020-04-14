import { all, spread } from 'axios';
import moment from 'moment';
import uniq from 'lodash/uniq';

import { fetchVIIRSAlerts, fetchVIIRSLatest } from 'services/analysis-cached';

import { POLITICAL_BOUNDARIES_DATASET } from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'firesAlerts',
  title: 'Fire Alerts in {location}',
  large: true,
  categories: ['summary', 'forest-change'],
  settingsConfig: [
    {
      key: 'compareYear',
      label: 'Compare with the same period in',
      type: 'compare-select',
      clearable: true,
      border: true
    },
    {
      key: 'confidence',
      label: 'Confidence level',
      type: 'select',
      clearable: false,
      border: true
    },
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
    }
  ],
  refetchKeys: ['forestType', 'landCategory', 'confidence'],
  visible: ['dashboard', 'analysis'],
  types: ['country'],
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
      dataset: '0f0ea013-20ac-4f4b-af56-c57e99f39e08',
      layers: ['5371d0c0-4e5f-45f7-9ff2-fe538914f7a3']
    }
  ],
  hideLayers: true,
  dataType: 'fires',
  colors: 'fires',
  metaKey: 'widget_fire_alert_location',
  sortOrder: {
    summary: 100,
    forestChange: 100
  },
  settings: {
    dataset: 'VIIRS',
    confidence: 'h'
  },
  sentence:
    'There were {count} {dataset} fire alerts reported in the week of the {date}. This was {status} compared to the same week in previous years.',
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

        return (
          {
            alerts: data,
            latest,
            options: {
              compareYear: years.filter(y => y !== maxYear).map(y => ({
                label: y,
                value: y
              })),
              confidence: [
                { label: 'All', value: '' },
                { label: 'High', value: 'h' }
              ]
            }
          } || {}
        );
      })
    ),
  getDataURL: params => [fetchVIIRSAlerts({ ...params, download: true })],
  getWidgetProps,
  parseInteraction: payload => {
    if (payload) {
      const startDate = moment()
        .year(payload.year)
        .week(payload.week);

      return {
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: startDate.add(7, 'days'),
        ...payload
      };
    }
    return {};
  }
};
