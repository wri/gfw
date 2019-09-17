import { getExtent } from 'services/forest-data';
import axios from 'axios';

import getWidgetProps from './selectors';

export default {
  widget: 'primaryForest',
  title: 'Primary forest in {location}',
  categories: ['land-cover'],
  types: ['country'],
  admins: ['adm0', 'adm1', 'adm2'],
  options: {
    landCategories: true,
    thresholds: true
  },
  chartType: 'pieChart',
  colors: 'extent',
  metaKey: 'widget_primary_forest',
  datasets: [
    // tree cover
    {
      dataset: '044f4af8-be72-4999-b7dd-13434fc4a394',
      layers: {
        2010: '78747ea1-34a9-4aa7-b099-bdb8948200f4',
        2000: 'c05c32fd-289c-4b20-8d73-dc2458234e04'
      }
    }
  ],
  sortOrder: {
    landCover: 4
  },
  settings: {
    forestType: 'primary_forest',
    threshold: 30,
    extentYear: 2000
  },
  sentences: {
    initial:
      'As of {extentYear}, {percentage} of {location} total tree cover was <b>primary forest</b>.',
    withIndicator:
      'As of {extentYear}, {percentage} of {location} total tree cover in {indicator} was <b>primary forest</b>.'
  },
  whitelists: {
    adm0: ['IDN', 'COD']
  },
  getData: params =>
    axios
      .all([
        getExtent({ ...params, forestType: '' }),
        getExtent({ ...params }),
        getExtent({
          ...params,
          forestType:
            params.forestType === 'primary_forest'
              ? 'plantations'
              : params.forestType
        })
      ])
      .then(
        axios.spread((gadm28Response, iflResponse, plantationsResponse) => {
          const gadmExtent = gadm28Response.data && gadm28Response.data.data;
          const primaryExtent = iflResponse.data && iflResponse.data.data;
          let totalArea = 0;
          let totalExtent = 0;
          let extent = 0;
          let plantations = 0;
          let data = {};
          const plantationsData =
            plantationsResponse.data && plantationsResponse.data.data;
          plantations = plantationsData.length ? plantationsData[0].extent : 0;
          if (primaryExtent.length && gadmExtent.length) {
            totalArea = gadmExtent[0].total_area;
            totalExtent = gadmExtent[0].extent;
            extent = primaryExtent[0].extent;
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
