import { all, spread } from 'axios';

import { getFAODeforest, getFAODeforestRank } from 'services/forest-data';

import getWidgetProps from './selectors';

export default {
  widget: 'faoDeforest',
  title: {
    global: 'Global FAO deforestation',
    initial: 'FAO deforestation in {location}'
  },
  categories: ['forest-change'],
  types: ['global', 'country'],
  admins: ['global', 'adm0'],
  settingsConfig: [
    {
      key: 'period',
      label: 'period',
      type: 'select'
    }
  ],
  chartType: 'rankedList',
  dataType: 'fao',
  colors: 'loss',
  metaKey: 'widget_deforestation_fao',
  sortOrder: {
    forestChange: 5
  },
  refetchKeys: ['period'],
  sentences: {
    globalInitial:
      'According to the FAO, the {location} rate of deforestation in {year} was {rate} per year.',
    globalHuman:
      'According to the FAO, the {location} rate of deforestation in {year} was {rate} per year, of which {human} per year was due to human activity.',
    initial:
      'According to the FAO, the rate of deforestation in {location} was {rate} per year in {year}.',
    humanDeforest:
      'According to the FAO, the rate of deforestation in {location} was {rate} per year in {year}, of which {human} per year was due to human activity.',
    noDeforest: 'No deforestation data in {location}.'
  },
  settings: {
    period: 2010,
    unit: 'ha/year',
    pageSize: 5,
    page: 0
  },
  getData: params =>
    all([getFAODeforest(params), getFAODeforestRank(params)]).then(
      spread((getFAODeforestResponse, getFAODeforestRankResponse) => {
        const fao = getFAODeforestResponse.data.rows;
        const rank = getFAODeforestRankResponse.data.rows;
        return {
          fao,
          rank
        };
      })
    ),
  getDataURL: params => [
    getFAODeforest({ ...params, download: true }),
    getFAODeforestRank({ ...params, download: true })
  ],
  getWidgetProps
};
