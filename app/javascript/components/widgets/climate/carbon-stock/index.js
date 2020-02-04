import { all, spread } from 'axios';

import { getSoilOrganicCarbon, getBiomassRanking } from 'services/climate';

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
      border: true
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  chartType: 'pieChart',
  colors: 'climate',
  metaKey: '',
  sortOrder: {
    climate: 4
  },
  settings: {
    variable: 'totalbiomass',
    threshold: 30
  },
  refetchKeys: ['threshold'],
  sentences:
    '{location} has a total carbon store of {carbonValue}, with most of the carbon stored in {carbonStored}.',
  getData: params =>
    all([
      getSoilOrganicCarbon({ ...params }),
      getBiomassRanking({ ...params })
    ]).then(
      spread((soilOrganicCarbon, aboveGroundBiomass) => {
        let level = 'iso';
        let paramLevel = 'adm0';
        if (params.adm1) {
          level = 'admin_1';
          paramLevel = 'adm1';
        } else if (params.adm2) {
          paramLevel = 'adm2';
        }

        return {
          soilCarbon: soilOrganicCarbon.data.rows.find(
            r => r[level] === params[paramLevel]
          ),
          aboveGround: aboveGroundBiomass.data.rows.find(
            r => r[level] === params[paramLevel]
          )
        };
      })
    ),
  getDataURL: params => [
    getSoilOrganicCarbon({ ...params, download: true }),
    getBiomassRanking({ ...params, download: true })
  ],
  getWidgetProps
};
