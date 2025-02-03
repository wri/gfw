import { all, spread } from 'axios';

import {
  getBiomassStock,
  getSoilOrganicCarbon,
} from 'services/analysis-cached';

import getWidgetProps from './selectors';

export default {
  widget: 'carbonStock',
  title: 'Carbon stock in {location}',
  categories: ['climate'],
  types: ['country'],
  admins: ['adm0', 'adm1', 'adm2'],
  settingsConfig: [
    {
      key: 'variable',
      label: 'Variable',
      type: 'switch',
      whitelist: ['totalbiomass', 'biomassdensity'],
      border: true,
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density',
    },
  ],
  chartType: 'pieChart',
  colors: 'climate',
  metaKey: '',
  sortOrder: {
    climate: 4,
  },
  settings: {
    variable: 'totalbiomass',
    threshold: 30,
  },
  refetchKeys: ['threshold'],
  sentences:
    '{location} has a total carbon store of {carbonValue}, with most of the carbon stored in {carbonStored}.',
  whitelists: {
    checkStatus: true,
  },
  getData: (params) =>
    all([getSoilOrganicCarbon(params), getBiomassStock(params)]).then(
      spread((soilOrganicCarbon, biomassResponse) => {
        const { data } = biomassResponse.data;
        const soilCarbonData = soilOrganicCarbon.data;
        let parsedData = {};
        if (data && data.length === 1) {
          parsedData = {
            ...data[0],
            ...soilCarbonData[0],
            soilCarbon: soilCarbonData.soil_carbon__t || 0,
            soilCarbonDensity: soilCarbonData.soil_carbon_density__t_ha || 0,
          };
        }
        return parsedData;
      })
    ),
  getDataURL: (params) => [
    getSoilOrganicCarbon({ ...params, download: true }),
    getBiomassStock({ ...params, download: true }),
  ],
  getWidgetProps,
};
