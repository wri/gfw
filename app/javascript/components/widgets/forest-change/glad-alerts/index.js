import axios from 'axios';
import moment from 'moment';

import { fetchAnalysisEndpoint } from 'services/analysis';
import { fetchGladAlerts, fetchGLADLatest } from 'services/alerts';

import getWidgetProps from './selectors';

export default {
  widget: 'gladAlerts',
  title: 'Deforestation Alerts in {location}',
  sentence:
    'There were {count} GLAD alerts reported in the week of the {date}. This was {status} compared to the same week in previous years.',
  metaKey: 'widget_deforestation_graph',
  large: true,
  visible: ['dashboard', 'analysis'],
  colors: 'loss',
  chartType: 'composedChart',
  source: 'gadm',
  dataType: 'loss',
  categories: ['summary', 'forest-change'],
  types: ['country', 'geostore', 'wdpa', 'use'],
  admins: ['adm0', 'adm1', 'adm2'],
  datasets: [
    {
      dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
      layers: [
        '6f6798e6-39ec-4163-979e-182a74ca65ee',
        'c5d1e010-383a-4713-9aaa-44f728c0571c'
      ],
      boundary: true
    },
    {
      dataset: 'e663eb09-04de-4f39-b871-35c6c2ed10b5',
      layers: ['dd5df87f-39c2-4aeb-a462-3ef969b20b66']
    }
  ],
  sortOrder: {
    summary: 6,
    forestChange: 9
  },
  pendingKeys: ['weeks'],
  settingsConfig: [
    {
      key: 'weeks',
      label: 'show data for the last',
      type: 'select',
      whitelist: [13, 26, 52],
      noSort: true
    }
  ],
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
  getData: params => {
    if (params.type !== 'country') {
      return fetchAnalysisEndpoint({
        ...params,
        params,
        name: 'glad-alerts',
        slug: 'glad-alerts',
        version: 'v1',
        aggregate: true,
        aggregateBy: 'week'
      }).then(response => {
        const alerts = response.data.data.attributes.value;
        const latest = alerts && alerts[0];
        const latestDate =
          latest &&
          moment()
            .year(latest.year)
            .week(latest.week)
            .day('5')
            .format('YYYY-MM-DD');

        return {
          alerts: alerts.map(d => ({
            ...d,
            alerts: d.count
          })),
          latest: latestDate,
          settings: { latestDate }
        };
      });
    }

    return axios.all([fetchGladAlerts(params), fetchGLADLatest(params)]).then(
      axios.spread((alerts, latest) => {
        const gladsData = alerts && alerts.data.data;
        let data = {};
        if (gladsData && latest) {
          const latestDate =
            latest && latest.attributes && latest.attributes.updatedAt;

          data = {
            alerts: gladsData,
            latest: latestDate,
            settings: { latestDate }
          };
        }

        return data;
      })
    );
  },
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
