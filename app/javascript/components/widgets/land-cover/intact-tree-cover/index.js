import { getExtent } from 'services/analysis-cached';
import axios from 'axios';

import getWidgetProps from './selectors';

export default {
  widget: 'intactTreeCover',
  title: {
    global: 'Global Intact forest',
    initial: 'Intact forest in {location}'
  },
  categories: ['land-cover'],
  types: ['global', 'country', 'geostore'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
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
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  chartType: 'pieChart',
  colors: 'extent',
  metaKey: 'widget_ifl',
  datasets: [
    {
      dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
      layers: [
        '6f6798e6-39ec-4163-979e-182a74ca65ee',
        'c5d1e010-383a-4713-9aaa-44f728c0571c'
      ],
      boundary: true
    },
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
  refetchKeys: ['forestType', 'threshold', 'extentYear'],
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
  whitelists: {
    checkStatus: true
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
