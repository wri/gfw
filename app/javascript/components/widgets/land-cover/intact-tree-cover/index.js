import { getExtent } from 'services/forest-data';
import axios from 'axios';

import getWidgetProps from './selectors';

export default {
  widget: 'intactTreeCover',
  title: {
    global: 'Global Intact forest',
    initial: 'Intact forest in {location}'
  },
  categories: ['land-cover'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  options: {
    landCategories: true,
    thresholds: true
  },
  chartType: 'pieChart',
  colors: 'extent',
  metaKey: 'widget_ifl',
  datasets: [
    {
      // ifl
      dataset: '13e28550-3fc9-45ec-bb00-5a48a82b77e1',
      layers: ['fd44b976-62e6-4072-8218-8abf6e254ed8']
    },
    // tree cover 2010
    {
      dataset: '044f4af8-be72-4999-b7dd-13434fc4a394',
      layers: {
        2010: '78747ea1-34a9-4aa7-b099-bdb8948200f4',
        2000: 'c05c32fd-289c-4b20-8d73-dc2458234e04'
      }
    }
  ],
  sortOrder: {
    landCover: 3
  },
  settings: {
    forestType: 'ifl',
    threshold: 30,
    extentYear: 2010,
    ifl: 2016
  },
  sentences: {
    initial:
      'As of 2016, {percentage} of {location} tree cover was <b>intact forest</b>.',
    withIndicator:
      'As of 2016, {percentage} of {location} tree cover in {indicator} was <b>intact forest</b>.',
    noIntact:
      'As of 2016, <b>none</b> of {location} tree cover was <b>intact forest</b>.',
    noIntactwithIndicator:
      'As of 2016, <b>none</b> of {location} tree cover in {indicator} was <b>intact forest</b>.'
  },
  getData: params =>
    axios
      .all([
        getExtent({ ...params, forestType: '' }),
        getExtent({ ...params }),
        getExtent({ ...params, forestType: 'plantations' })
      ])
      .then(
        axios.spread((gadm28Response, iflResponse, plantationsResponse) => {
          const gadmExtent = gadm28Response.data && gadm28Response.data.data;
          const iflExtent = iflResponse.data && iflResponse.data.data;
          let totalArea = 0;
          let totalExtent = 0;
          let extent = 0;
          let plantations = 0;
          let data = {};
          const plantationsData =
            plantationsResponse.data && plantationsResponse.data.data;
          plantations = plantationsData.length ? plantationsData[0].extent : 0;
          if (iflExtent.length && gadmExtent.length) {
            totalArea = gadmExtent[0].total_area;
            totalExtent = gadmExtent[0].extent;
            extent = iflExtent[0].extent;
            data = {
              totalArea,
              totalExtent,
              extent,
              plantations
            };
          }
          return data;
        })
      ),
  getWidgetProps
};
