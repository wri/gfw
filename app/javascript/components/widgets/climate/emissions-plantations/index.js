import { getLoss } from 'services/forest-data-old';
import { all, spread } from 'axios';
import max from 'lodash/max';
import maxBy from 'lodash/maxBy';
import range from 'lodash/range';

import biomassLossIsos from 'data/biomass-isos.json';

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
    getLoss({ ...params, indicator: 'plantations', download: true })
  ],
  getWidgetProps
};
