import { all, spread } from 'axios';
import {
  getExtent,
  getTropicalExtent,
  getTropicalTreeCover,
} from 'services/analysis-cached';
import OTFAnalysis from 'services/otf-analysis';

import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';
import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_EXTENT_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_EXTENT,
  TREE_COVER,
} from 'data/layers';

import getWidgetProps from './selectors';

const getOTFAnalysis = async (params) => {
  const analysis = new OTFAnalysis(params.geostore.id);
  analysis.setDates({
    startDate: params.startDate,
    endDate: params.endDate,
  });
  analysis.setData(['areaHa', 'extent'], params);

  return analysis.getData().then((response) => {
    const { areaHa, extent } = response;
    const totalArea = areaHa?.[0]?.area__ha;
    const totalCover = extent?.[0]?.area__ha;

    return {
      totalArea,
      totalCover,
      cover: totalCover,
      plantations: 0,
    };
  });
};

export default {
  widget: 'treeCover',
  title: {
    default: 'Tree Cover by type in {location}',
    global: 'Global tree cover by type',
    withPlantations: 'Forest cover by type in {location}',
  },
  alerts: [
    {
      id: 'tree-cover-alert-1',
      // TODO: Add link
      text:
        'Datasets used here use different methodologies to measure tree cover. [Read more on our blog](#) for more information.',
      visible: [
        'global',
        'country',
        'geostore',
        'aoi',
        'wdpa',
        'use',
        'dashboard',
      ],
    },
  ],
  sentence: {
    globalInitial:
      'As of {year}, {percentage} of {location} land cover was {threshold} tree cover.',
    // TODO: with indicators (global and others)
    globalWithIndicator:
      'As of {year}, {percentage} of {location} tree cover was in {indicator}.',
    initial:
      'As of {year}, {percentage} of {location} was {threshold} tree cover.',

    hasPlantations: ' was natural forest cover.',
    noPlantations: ' was tree cover.',
    hasPlantationsInd: "<b>'s</b> natural forest was in {indicator}.",
    noPlantationsInd: "<b>'s</b> tree cover was in {indicator}.",
  },
  metaKey: 'widget_tree_cover',
  chartType: 'pieChart',
  large: false,
  colors: 'extent',
  source: 'gadm',
  dataType: 'extent',
  categories: ['summary', 'land-cover'],
  types: ['global', 'country', 'geostore', 'aoi', 'wdpa', 'use'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  visible: ['dashboard'],
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    {
      dataset: FOREST_EXTENT_DATASET,
      layers: {
        2010: FOREST_EXTENT,
        2000: TREE_COVER,
      },
    },
  ],
  sortOrder: {
    summary: 4,
    landCover: 1,
  },
  refetchKeys: ['threshold', 'extentYear', 'landCategory'],
  pendingKeys: ['threshold', 'extentYear'],
  settingsConfig: [
    {
      key: 'extentYear',
      label: 'Tree cover dataset',
      type: 'select',
      border: true,
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true,
    },
    {
      key: 'threshold',
      label: 'Tree cover',
      type: 'mini-select',
      metaKey: 'widget_canopy_density',
    },
  ],
  settings: {
    threshold: 30,
    extentYear: 2000,
  },
  getData: (params) => {
    const { extentYear } = params;

    if (extentYear === 2000 || extentYear === 2010) {
      if (shouldQueryPrecomputedTables(params)) {
        return all([
          getExtent(params),
          getExtent({ ...params, forestType: '', landCategory: '' }),
          getExtent({ ...params, forestType: 'plantations' }),
        ]).then(
          spread((response, adminResponse, plantationsResponse) => {
            const extent = response.data && response.data.data;
            const adminExtent = adminResponse.data && adminResponse.data.data;
            const plantationsExtent =
              plantationsResponse.data && plantationsResponse.data.data;
            let totalArea = 0;
            let totalCover = 0;
            let cover = 0;
            let plantations = 0;
            let data = {};
            if (extent && extent.length) {
              // Sum values
              totalArea = adminExtent.reduce(
                (total, d) => total + d.total_area,
                0
              );
              cover = extent.reduce((total, d) => total + d.extent, 0);
              totalCover = adminExtent.reduce(
                (total, d) => total + d.extent,
                0
              );
              plantations = plantationsExtent.reduce(
                (total, d) => total + d.extent,
                0
              );
              data = {
                totalArea,
                totalCover,
                cover,
                plantations,
              };
            }
            return data;
          })
        );
      }
    }

    if (shouldQueryPrecomputedTables(params)) {
      return all([
        getTropicalTreeCover({
          ...params,
          area: 'wri_tropical_tree_cover_extent__ha',
        }),
        getTropicalTreeCover({ ...params, area: 'area__ha', threshold: 0 }),
        getTropicalTreeCover({
          ...params,
          area: 'wri_tropical_tree_cover_extent__ha',
          forestType: 'plantations',
        }),
      ]).then(
        spread((extentResponse, fullExtentResponse, plantationsResponse) => {
          const extent = extentResponse.data;
          const fullExtent = fullExtentResponse.data;
          const plantationsExtent = plantationsResponse.data;

          let totalArea = 0;
          let cover = 0;
          let plantations = 0;
          let data = {};
          if (extent && extent.length) {
            // Sum values
            totalArea = fullExtent.reduce((total, d) => total + d.area__ha, 0);
            cover = extent.reduce(
              (total, d) => total + d.wri_tropical_tree_cover_extent__ha,
              0
            );
            plantations = plantationsExtent.reduce(
              (total, d) => total + d.wri_tropical_tree_cover_extent__ha,
              0
            );
            data = {
              totalArea,
              cover,
              plantations,
            };
          }
          return data;
        })
      );
    }

    return getOTFAnalysis(params);
  },
  getDataURL: (params) => {
    const { threshold, ...filteredParams } = params;
    const { extentYear } = filteredParams;
    const decile = threshold;
    const isTropicalTreeCover = !(extentYear === 2000 || extentYear === 2010);
    const downloadFn = isTropicalTreeCover ? getTropicalExtent : getExtent;
    const decileThreshold = isTropicalTreeCover ? { decile } : { threshold };
    const commonParams = {
      ...filteredParams,
      ...decileThreshold,
      download: true,
    };

    return [
      downloadFn({ ...commonParams, forestType: null, landCategory: null }),
      downloadFn({ ...commonParams, forestType: 'plantations' }),
      ...(filteredParams?.forestType || filteredParams?.landCategory
        ? downloadFn({ ...commonParams })
        : []),
    ];
  },
  getWidgetProps,
};
