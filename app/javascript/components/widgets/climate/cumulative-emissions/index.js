import axios from 'axios';
import { getCumulative } from 'services/climate';

import getWidgetProps from './selectors';

export default {
  widget: 'cumulativeGlad',
  title: 'New York Declaration Forest disturbance tracker',
  large: true,
  categories: ['climate'],
  options: {
    years: true,
    variables: ['cumulative_emissions', 'cumulative_deforestation']
  },
  settingsConfig: [
    {
      key: 'variable',
      label: 'Variable',
      type: 'select',
      whitelist: ['cumulative_emissions', 'cumulative_deforestation']
    },
    {
      key: 'years',
      label: 'years',
      type: 'select'
    }
  ],
  analysis: true,
  datasets: [
    // GLAD
    {
      dataset: 'e663eb09-04de-4f39-b871-35c6c2ed10b5',
      layers: ['dd5df87f-39c2-4aeb-a462-3ef969b20b66']
    }
  ],
  types: ['country'],
  admins: ['adm0'],
  colors: 'fires',
  metaKey: 'widget_nydf_emissions_tracker',
  sortOrder: {
    summary: 100,
    forestChange: 100
  },
  sentences: {
    cumulative_deforestation: `By week {weeknum} of {year}, there were {alerts}
confirmed alerts and {deforestation} of tree cover loss, comprising {budget} of
the annual budget. The values are shown in relation to deforestation
across previous years, indicated by the grey shading.`,
    cumulative_emissions: `By week {weeknum} of {year}, there were {alerts}
confirmed alerts and {emissions} emissions, comprising {budget} of
the annual budget. The values are shown in relation to emissions
across previous years, indicated by the grey shading.`
  },
  whitelists: {
    adm0: [
      'BRA',
      'BRN',
      'BDI',
      'CMR',
      'CAF',
      'COD',
      'GNQ',
      'GAB',
      'IDN',
      'MYS',
      'PNG',
      'PER',
      'COG',
      'RWA',
      'SGP',
      'TLS'
    ]
  },
  settings: {
    years: 2018,
    variable: 'cumulative_deforestation'
  },
  getData: params =>
    axios.all([...getCumulative({ ...params })]).then(
      axios.spread((y2015, y2016, y2017, y2018) => {
        const years = [2015, 2016, 2017, 2018].map(year => ({
          label: year,
          value: year
        }));
        const data = {
          2015: y2015.data && y2015.data.data,
          2016: y2016.data && y2016.data.data,
          2017: y2017.data && y2017.data.data,
          2018: y2018.data && y2018.data.data
        };

        return {
          data,
          options: { years }
        };
      })
    ),
  getWidgetProps
};
