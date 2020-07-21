import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';

import { getFAOEcoLive } from 'services/forest-data';

import getWidgetProps from './selectors';

export default {
  widget: 'economicImpact',
  title: 'Economic Impact of forests in {location}',
  large: true,
  categories: ['land-use'],
  types: ['country'],
  admins: ['adm0'],
  settingsConfig: [
    {
      key: 'year',
      label: 'year',
      type: 'select'
    },
    {
      key: 'unit',
      label: 'unit',
      type: 'switch',
      whitelist: ['net_usd', 'net_perc']
    }
  ],
  chartType: 'chartList',
  dataType: 'fao',
  colors: 'employment',
  metaKey: 'widget_economic_impact',
  sortOrder: {
    landUse: 2
  },
  settings: {
    unit: 'net_usd'
  },
  sentence:
    'According to the FAO, the forestry sector contributed a net {value} to the economy in {year}, which is approximately {percentage} of {location} GDP.',
  whitelists: {
    adm0: [
      'AGO',
      'ALB',
      'ARG',
      'ARM',
      'BEL',
      'BEN',
      'BFA',
      'BGD',
      'BGR',
      'BLM',
      'BLR',
      'BRA',
      'BRN',
      'BTN',
      'BWA',
      'CHL',
      'CHN',
      'CRI',
      'CUB',
      'CYP',
      'DNK',
      'DOM',
      'DZA',
      'EGY',
      'FIN',
      'FJI',
      'FLK',
      'FRA',
      'FRO',
      'GAB',
      'GBR',
      'GEO',
      'GIB',
      'GLP',
      'GMB',
      'GNQ',
      'GRL',
      'GTM',
      'GUF',
      'GUY',
      'HRV',
      'HUN',
      'IDN',
      'IND',
      'IRN',
      'ISL',
      'JAM',
      'JPN',
      'KEN',
      'KGZ',
      'KHM',
      'KIR',
      'KOR',
      'LAO',
      'LBN',
      'LCA',
      'LKA',
      'LTU',
      'LVA',
      'MAR',
      'MCO',
      'MEX',
      'MLI',
      'MMR',
      'MNE',
      'MNG',
      'MRT',
      'MTQ',
      'MUS',
      'MWI',
      'MYS',
      'MYT',
      'NER',
      'NPL',
      'NRU',
      'NZL',
      'PAN',
      'PER',
      'PHL',
      'PNG',
      'POL',
      'PRY',
      'PYF',
      'QAT',
      'REU',
      'RUS',
      'RWA',
      'SDN',
      'SEN',
      'SGP',
      'SJM',
      'SLE',
      'SMR',
      'SRB',
      'SUR',
      'SVK',
      'SVN',
      'SWE',
      'SYC',
      'SYR',
      'TGO',
      'TKL',
      'TON',
      'TTO',
      'TUN',
      'TUR',
      'TZA',
      'URY',
      'USA',
      'UZB',
      'VAT',
      'VEN',
      'VUT',
      'WLF',
      'ZWE'
    ]
  },
  getData: params =>
    getFAOEcoLive(params.token).then(response => {
      const { rows } = response.data;
      const { adm0, year } = params;
      const years = sortBy(
        uniq(
          rows
            .filter(
              d =>
                d.country === adm0 &&
                d.year !== 9999 &&
                d.usdrev !== null &&
                d.usdexp !== null &&
                d.usdexp !== ''
            )
            .map(d => ({ label: d.year, value: d.year }))
        )
      );
      const payload = {
        data: rows || {},
        options: {
          year: years
        },
        settings: {
          year: years.includes(year) ? year.value : years[0].value
        }
      };
      return payload;
    }),
  getDataURL: () => [getFAOEcoLive({ download: true })],
  getWidgetProps
};
