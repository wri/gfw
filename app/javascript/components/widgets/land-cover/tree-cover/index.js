import axios from 'axios';
import { getExtent } from 'services/forest-data';
import { fetchAnalysisEndpoint } from 'services/analysis';
import getWidgetProps from './selectors';

export const getDataAPI = ({ params }) =>
  fetchAnalysisEndpoint({
    ...params,
    name: 'umd',
    params,
    slug: 'umd-loss-gain',
    version: 'v1',
    nonAggregate: true
  }).then(response => {
    const { data } = (response && response.data) || {};
    const totalArea = data && data.attributes.areaHa;
    const exentKey = params.extentYear === 2010 ? '2010' : '';
    const totalExtent = data && data.attributes[exentKey];

    return {
      totalArea,
      totalExtent,
      cover: 0
    };
  });

export default {
  // key for url and state
  widget: 'treeCover',
  // title for header
  title: {
    default: 'Tree cover in {location}',
    global: 'Global forest cover',
    withPlantations: 'Forest cover in {location}'
  },
  // sentences for header
  sentence: {
    globalInitial:
      'As of {year}, {percentage} of {location} land cover was tree cover.',
    globalWithIndicator:
      'As of {year}, {percentage} of {location} tree cover was in {indicator}.',
    initial: 'As of {year}, {percentage} of {location}',
    hasPlantations: ' was natural forest cover.',
    noPlantations: ' was tree cover.',
    hasPlantationsInd: "<b>'s</b> natural forest was in {indicator}.",
    noPlantationsInd: "<b>'s</b> tree cover was in {indicator}."
  },
  // meta key for info button
  metaKey: 'widget_tree_cover',
  chartType: 'pieChart',
  // full width or not
  large: false,
  // internal category for colors and filters
  colors: 'extent',
  // data source for filtering
  source: 'gadm',
  // data source for filtering
  dataType: 'extent',
  // categories to show widget on
  categories: ['summary', 'land-cover'],
  // types widget is available for
  types: ['global', 'country', 'geostore'],
  // levels of that type you can see the widget
  admins: ['global', 'adm0', 'adm1', 'adm2'],
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
  // position
  sortOrder: {
    summary: 4,
    landCover: 1
  },
  refetchKeys: ['threshold', 'extentYear', 'landCategory'],
  pendingKeys: ['threshold', 'extentYear'],
  // whitelists for options
  settingsConfig: [
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true
    },
    {
      key: 'extentYear',
      label: 'extent year',
      type: 'switch',
      border: true
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  settings: {
    threshold: 30,
    extentYear: 2000
  },
  getData: params => {
    if (params.type !== 'country' && params.type !== 'global') {
      return getDataAPI({ params });
    }

    return axios
      .all([
        getExtent(params),
        getExtent({ ...params, forestType: '', landCategory: '' }),
        getExtent({ ...params, forestType: 'plantations' })
      ])
      .then(
        axios.spread((response, adminResponse, plantationsResponse) => {
          const extent = response.data && response.data.data;
          const adminExtent = adminResponse.data && adminResponse.data.data;
          let totalArea = 0;
          let totalCover = 0;
          let cover = 0;
          let plantations = 0;
          let data = {};
          if (extent && extent.length) {
            totalArea = adminExtent[0].total_area;
            cover = extent[0].extent;
            totalCover = adminExtent[0].extent;
            data = {
              totalArea,
              totalCover,
              cover,
              plantations
            };
          }
          if (params.forestType || params.landCategory) {
            return data;
          }
          // if plantations get more data
          const plantationsData =
            plantationsResponse.data && plantationsResponse.data.data;
          plantations =
            plantationsData && plantationsData.length
              ? plantationsData[0].extent
              : 0;
          if (extent && extent.length) {
            data = {
              ...data,
              plantations
            };
          }

          return data;
        })
      );
  },
  getWidgetProps
};
