import { fetchAnalysisEndpoint } from 'services/analysis';

import { getYearsRange } from 'components/widgets/utils/data';
import getWidgetProps from './selectors';

export default {
  widget: 'emissionsDeforestation',
  title: 'Emissions from biomass loss in {location}',
  categories: ['climate'],
  types: ['country', 'geostore', 'use', 'wdpa'],
  admins: ['adm0', 'adm1', 'adm2'],
  chartType: 'composedChart',
  settingsConfig: [
    {
      key: 'unit',
      label: 'unit',
      type: 'switch',
      whitelist: ['co2LossByYear', 'biomassLoss']
    },
    {
      key: 'years',
      label: 'years',
      endKey: 'endYear',
      startKey: 'startYear',
      type: 'range-select',
      border: true
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
      dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
      layers: [
        '6f6798e6-39ec-4163-979e-182a74ca65ee',
        'c5d1e010-383a-4713-9aaa-44f728c0571c'
      ],
      boundary: true
    },
    // biomass loss
    {
      dataset: 'a9cc6ec0-5c1c-4e36-9b26-b4ee0b50587b',
      layers: ['b32a2f15-25e8-4ecc-98e0-68782ab1c0fe']
    }
  ],
  pendingKeys: ['threshold', 'unit'],
  refetchKeys: ['threshold'],
  analysis: true,
  metaKey: 'widget_carbon_emissions_tree_cover_loss',
  dataType: 'loss',
  colors: 'climate',
  sortOrder: {
    climate: 2
  },
  sentences:
    'Between {startYear} and {endYear}, a total of {value} of {type} ({annualAvg} per year) was released into the atmosphere as a result of tree cover loss in {location}.',
  settings: {
    unit: 'co2LossByYear',
    threshold: 30,
    startYear: 2001,
    endYear: 2018
  },
  getData: params =>
    fetchAnalysisEndpoint({
      ...params,
      name: 'Umd',
      params,
      slug: params.type === 'geostore' ? 'biomass-loss' : 'umd-loss-gain',
      version: params.type === 'geostore' ? 'v1' : 'v3',
      nonAggregate: true
    }).then(response => {
      const { attributes: data } =
        (response && response.data && response.data.data) || {};
      let loss = [];

      if (params.type === 'geostore') {
        const biomassData = data.biomassLossByYear;
        const emissionsData = data.co2LossByYear;
        loss = Object.keys(biomassData).map(l => ({
          year: l,
          emissions: emissionsData[l],
          biomassLoss: biomassData[l]
        }));
      } else {
        loss = data.years;
      }

      const { startYear, endYear, range } = getYearsRange(loss);

      return {
        loss,
        settings: {
          startYear,
          endYear
        },
        options: {
          years: range
        }
      };
    }),
  getWidgetProps
};
