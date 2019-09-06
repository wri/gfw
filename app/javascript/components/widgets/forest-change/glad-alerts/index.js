import axios from 'axios';
import moment from 'moment';

import { fetchGladAlerts, fetchGLADLatest } from 'services/alerts';

import getWidgetProps from './selectors';

export default {
  widget: 'gladAlerts',
  title: 'Deforestation Alerts in {location}',
  sentence:
    'There were {count} GLAD alerts reported in the week of the {date}. This was {status} compared to the same week in previous years.',
  metaKey: 'widget_deforestation_graph',
  large: true,
  analysis: true,
  colors: 'loss',
  chartType: 'composedChart',
  source: 'gadm',
  dataType: 'loss',
  categories: ['summary', 'forest-change'],
  types: ['country'],
  admins: ['adm0', 'adm1', 'adm2'],
  datasets: [
    {
      dataset: 'e663eb09-04de-4f39-b871-35c6c2ed10b5',
      layers: ['dd5df87f-39c2-4aeb-a462-3ef969b20b66']
    }
  ],
  sortOrder: {
    summary: 6,
    forestChange: 9
  },
  options: {
    weeks: [13, 26, 52]
  },
  whitelists: {
    adm0: [
      'ABW',
      'AGO',
      'AIA',
      'ARG',
      'ATG',
      'AUS',
      'BDI',
      'BEN',
      'BES',
      'BFA',
      'BGD',
      'BHS',
      'BLM',
      'BLZ',
      'BOL',
      'BRA',
      'BRB',
      'BRN',
      'BTN',
      'BWA',
      'CAF',
      'CHL',
      'CHN',
      'CIV',
      'CMR',
      'COD',
      'COG',
      'COL',
      'COM',
      'CRI',
      'CUB',
      'CUW',
      'CYM',
      'DMA',
      'DOM',
      'ECU',
      'EGY',
      'ESP',
      'ETH',
      'FJI',
      'GAB',
      'GHA',
      'GIN',
      'GLP',
      'GMB',
      'GNB',
      'GNQ',
      'GRD',
      'GTM',
      'GUF',
      'GUY',
      'HKG',
      'HND',
      'HTI',
      'IDN',
      'IND',
      'IRN',
      'JAM',
      'JPN',
      'KEN',
      'KHM',
      'KNA',
      'LAO',
      'LBR',
      'LCA',
      'LKA',
      'LSO',
      'MAC',
      'MAF',
      'MDG',
      'MEX',
      'MLI',
      'MMR',
      'MOZ',
      'MSR',
      'MTQ',
      'MUS',
      'MWI',
      'MYS',
      'MYT',
      'NAM',
      'NCL',
      'NER',
      'NGA',
      'NIC',
      'NPL',
      'OMN',
      'PAK',
      'PAN',
      'PER',
      'PHL',
      'PLW',
      'PNG',
      'PRI',
      'PRY',
      'REU',
      'RUS',
      'RWA',
      'SDN',
      'SEN',
      'SGP',
      'SLB',
      'SLE',
      'SLV',
      'SOM',
      'SSD',
      'SUR',
      'SWZ',
      'SXM',
      'SYC',
      'TCA',
      'TCD',
      'TGO',
      'THA',
      'TLS',
      'TTO',
      'TWN',
      'TZA',
      'UGA',
      'USA',
      'VCT',
      'VEN',
      'VGB',
      'VIR',
      'VNM',
      'VUT',
      'YEM',
      'ZAF',
      'ZMB',
      'ZWE'
    ]
  },
  settings: {
    period: 'week',
    weeks: 13
  },
  getData: params =>
    axios.all([fetchGladAlerts(params), fetchGLADLatest(params)]).then(
      axios.spread((alerts, latest) => {
        let data = {};
        if (alerts && alerts.data && latest) {
          const latestDate =
            latest && latest.attributes && latest.attributes.updatedAt;

          data = {
            alerts: alerts.data.data,
            latest: latestDate,
            settings: { latestDate }
          };
        }

        return data;
      })
    ),
  getWidgetProps,
  parseInteraction: payload => {
    if (payload) {
      const startDate = moment()
        .year(payload.year)
        .week(payload.week);

      return {
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: startDate.add(7, 'days').format('YYYY-MM-DD'),
        updateLayer: true,
        ...payload
      };
    }
    return {};
  }
};
