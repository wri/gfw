import { fetchAnalysisEndpoint } from 'services/analysis';
import { getLoss } from 'services/analysis-cached';

import biomassLossIsos from 'data/biomass-isos.json';
import { POLITICAL_BOUNDARIES_DATASET } from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES
} from 'data/layers';

import { getYearsRange } from 'components/widgets/utils/data';
import getWidgetProps from './selectors';

const getDataFromAPI = params =>
  fetchAnalysisEndpoint({
    ...params,
    name: 'Umd',
    params,
    slug: ['wdpa', 'use', 'geostore'].includes(params.type)
      ? 'biomass-loss'
      : 'umd-loss-gain',
    version: ['wdpa', 'use', 'geostore'].includes(params.type) ? 'v1' : 'v3',
    aggregate: false
  }).then(response => {
    const { attributes: data } =
      (response && response.data && response.data.data) || {};
    let loss = [];

    if (['wdpa', 'use', 'geostore'].includes(params.type)) {
      const biomassData = data.biomassLossByYear;
      const emissionsData = data.co2LossByYear;
      loss = Object.keys(biomassData).map(l => ({
        year: parseInt(l, 10),
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
  });

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
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
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
  visible: ['dashboard', 'analysis'],
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
  whitelists: {
    adm0: biomassLossIsos
  },
  getData: params => {
    const { status, type } = params || {};

    if (status === 'pending' || !['global', 'country'].includes(type)) {
      return getDataFromAPI(params);
    }

    return getLoss(params).then(response => {
      const loss = response.data.data;
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
    });
  },
  getDataURL: params => [getLoss({ ...params, download: true })],
  getWidgetProps
};
