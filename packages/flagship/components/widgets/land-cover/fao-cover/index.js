import { all, spread } from 'axios';
import sumBy from 'lodash/sumBy';
import omit from 'lodash/omit';

import { getFAOExtent } from 'services/forest-data';
import { getRanking } from 'services/country';

import getWidgetProps from './selectors';

export default {
  widget: 'faoCover',
  title: {
    initial: 'FAO forest cover in {location}',
    global: 'Global FAO forest cover'
  },
  chartType: 'pieChart',
  categories: ['land-cover'],
  types: ['global', 'country'],
  admins: ['global', 'adm0'],
  colors: 'extent',
  dataType: 'fao',
  metaKey: 'widget_forest_cover_fao',
  sortOrder: {
    landCover: 5
  },
  settings: {
    unit: 'ha'
  },
  sentences: {
    globalInitial:
      'FAO data from 2015 shows that there are {extent} of forest {location}, with primary forest occupying {primaryPercent} of the world.',
    globalNoPrimary:
      'FAO data from 2015 shows that there are {extent} of forest {location}, which occupies {primaryPercent} of the world.',
    initial:
      'FAO data from 2015 shows that {location} contains {extent} of forest, with primary forest occupying {primaryPercent} of the country.',
    noPrimary:
      'FAO data from 2015 shows that {location} contains {extent} of forest, which occupies {primaryPercent} of the country.'
  },
  getData: params =>
    all([getFAOExtent({ ...params }), getRanking({ ...params })]).then(
      spread((getFAOResponse, getRankingResponse) => {
        let data = {};
        const fao = getFAOResponse.data.rows;
        const ranking = getRankingResponse.data.rows;
        if (fao.length && ranking.length) {
          const faoTotal = fao.map(f => ({
            ...f,
            area_ha: parseFloat(f.area_ha.replace(',', '')) * 1000
          }));
          let faoData = faoTotal[0];
          if (fao.length > 1) {
            faoData = {};
            Object.keys(omit(faoTotal[0], ['iso', 'name'])).forEach(k => {
              faoData[k] = sumBy(faoTotal, k) || 0;
            });
          }
          data = {
            ...faoData,
            rank: ranking[0].rank || 0
          };
        }
        return data;
      })
    ),
  getDataURL: ({ params }) => [getFAOExtent({ ...params, download: true })],
  getWidgetProps
};
