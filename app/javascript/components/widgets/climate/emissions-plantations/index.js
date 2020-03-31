import { getLoss } from 'services/analysis-cached';
import { all, spread } from 'axios';
import max from 'lodash/max';
import maxBy from 'lodash/maxBy';
import range from 'lodash/range';

import biomassLossIsos from 'data/biomass-isos.json';
import {
  POLITICAL_BOUNDARIES_DATASET,
  BIOMASS_LOSS_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  BIOMASS_LOSS
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'emissions-plantations',
  title: {
    initial: 'Biomass loss emissions in natural forest vs. plantations'
  },
  categories: ['climate'],
  types: ['country', 'geostore'],
  admins: ['adm0', 'adm1', 'adm2'],
  settingsConfig: [
    {
      key: 'unit',
      label: 'unit',
      type: 'switch',
      whitelist: ['co2LossByYear', 'cLossByYear']
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
  refetchKeys: ['threshold'],
  chartType: 'pieChart',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    // biomass loss
    {
      dataset: BIOMASS_LOSS_DATASET,
      layers: [BIOMASS_LOSS]
    }
  ],
  visible: ['dashboard', 'analysis'],
  colors: 'climate',
  metaKey: 'tree_biomass_loss',
  sortOrder: {
    climate: 3
  },
  sentences: {
    initial:
      'From {startYear} to {endYear}, a total of {emissions} of {variable} emissions were released from tree cover loss in {location} natural forests.'
  },
  whitelists: {
    indicators: ['plantations'],
    adm0: biomassLossIsos,
    checkStatus: true
  },
  settings: {
    forestType: 'ifl',
    ifl: 2016,
    threshold: 30,
    startYear: 2013,
    endYear: 2018,
    unit: 'co2LossByYear'
  },
  getData: params =>
    all([
      getLoss(params),
      getLoss({ ...params, forestType: 'plantations' })
    ]).then(
      spread((admin, plantations) => {
        const adminData = admin.data && admin.data.data;
        const plantData = plantations.data && plantations.data.data;

        const maxAdmin = maxBy(adminData, 'year');
        const maxPlantations = maxBy(plantData, 'year');
        const maxYear =
          (maxAdmin &&
            maxPlantations &&
            max([maxAdmin.year, maxPlantations.year])) ||
          2018;

        return {
          adminData,
          plantData,
          options: {
            years: range(2013, maxYear + 1).map(y => ({ label: y, value: y }))
          },
          settings: {
            startYear: 2013,
            endYear: maxYear
          }
        };
      })
    ),
  getDataURL: params => [
    getLoss({ ...params, download: true }),
    getLoss({ ...params, forestType: 'plantations', download: true })
  ],
  getWidgetProps
};
