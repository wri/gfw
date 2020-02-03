import { all, spread } from 'axios';
import { getEmissions } from 'services/climate';

import getWidgetProps from './selectors';

export default {
  widget: 'futureCarbonGains',
  title: {
    initial: 'Annual tree cover loss by dominant driver in {location}',
    global: 'Global annual tree cover loss by dominant driver'
  },
  categories: ['climate'],
  colors: 'climate',
  types: ['country'],
  admins: ['adm0'],
  settingsConfig: [
    {
      key: 'unit',
      label: 'unit',
      type: 'switch',
      whitelist: ['co2Gain', 'cGain']
    }
  ],
  metaKey: 'potential_tree_biomass_gain',
  sortOrder: {
    summary: 1,
    forestChange: 1,
    global: 1
  },
  chartType: 'composedChart',
  datasets: [
    {
      dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
      layers: [
        '6f6798e6-39ec-4163-979e-182a74ca65ee',
        'c5d1e010-383a-4713-9aaa-44f728c0571c'
      ],
      boundary: true
    },
    // potential carbon gains
    {
      dataset: 'b7a34457-1d8a-456e-af46-876e0b42fb96',
      layers: ['fffa76d3-5008-48b7-afeb-2c7054548f2e']
    }
  ],
  visible: ['dashboard', 'analysis'],
  sentences: {
    initial:
      'In {location}, potential carbon sequestration may reach {amount} of {variable} by {maxYear}.'
  },
  settings: {
    unit: 'co2Gain'
  },
  whitelists: {
    adm0: [
      'ARG',
      'BLZ',
      'BOL',
      'BRA',
      'COL',
      'CRI',
      'CUB',
      'ECU',
      'SLV',
      'GTM',
      'GUY',
      'HND',
      'JAM',
      'MEX',
      'NIC',
      'PAN',
      'PRY',
      'PER',
      'PRI',
      'SUR',
      'VEN'
    ]
  },
  getData: params =>
    all([...getEmissions({ ...params })]).then(
      spread(
        (
          cYSF,
          cMASF,
          cPasture,
          cCrops,
          co2YSF,
          co2MASF,
          co2Pasture,
          co2Crops
        ) => {
          const data = {
            cGain: {
              YSF: cYSF.data && cYSF.data.rows,
              MASF: cMASF.data && cMASF.data.rows,
              Pasture: cPasture.data && cPasture.data.rows,
              Crops: cCrops.data && cCrops.data.rows
            },
            co2Gain: {
              YSF: co2YSF.data && co2YSF.data.rows,
              MASF: co2MASF.data && co2MASF.data.rows,
              Pasture: co2Pasture.data && co2Pasture.data.rows,
              Crops: co2Crops.data && co2Crops.data.rows
            }
          };
          return data;
        }
      )
    ),
  getDataURL: params => getEmissions({ ...params, download: true }),
  getWidgetProps
};
