import sumBy from 'lodash/sumBy';
import omit from 'lodash/omit';

import { getFAOExtent } from 'services/forest-data';
import getWidgetProps from './selectors';

export default {
  widget: 'faoCover',
  title: {
    initial: 'FAO forest cover in {location}',
    global: 'Global FAO forest cover',
  },
  chartType: 'pieChart',
  categories: ['land-cover'],
  types: ['global', 'country'],
  admins: ['global', 'adm0'],
  colors: 'extent',
  dataType: 'fao',
  metaKey: 'widget_forest_cover_fao',
  sortOrder: {
    landCover: 5,
  },
  settings: {
    unit: 'ha',
    faoYear: 2020,
  },
  refetchKeys: ['faoYear'],
  sentences: {
    globalInitial:
      'According to the FAO, in {year}, {percent} ({amountInHectares}) of the globe was covered by forest. {primaryPercent} of that forest was classified as primary forest.',
    initial:
      'According to the FAO, in {year}, {percent} ({amountInHectares}) of {country} was covered by forest. {primaryPercent} of that forest was classified as primary forest.',
    noPrimary:
      'According to the FAO, in {year}, {primaryPercent} ({extent}) of {location} was covered by forest. <b>0%</b> of that forest was classified as primary forest.',
  },
  getSettingsConfig: () => {
    return [
      {
        key: 'faoYear',
        label: 'Period',
        type: 'select',
        clearable: false,
        border: true,
      },
    ];
  },
  getData: (params) => {
    return getFAOExtent({ ...params }).then((getFAOResponse) => {
      let data = {};
      const fao = getFAOResponse.data.rows;

      if (fao.length) {
        let faoData = fao[0];

        if (fao.length > 1) {
          faoData = {};
          Object.keys(omit(fao[0], ['iso', 'country'])).forEach((k) => {
            faoData[k] = sumBy(fao, k) || 0;
          });
        }

        data = {
          ...faoData,
        };
      }
      return data;
    });
  },
  getDataURL: async (params) => [
    await getFAOExtent({ ...params, download: true }),
  ],
  getWidgetProps,
};
