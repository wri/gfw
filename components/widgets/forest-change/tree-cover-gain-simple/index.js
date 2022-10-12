import { getGain } from 'services/analysis-cached';
import OTFAnalysis from 'services/otf-analysis';

import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_GAIN_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_GAIN,
} from 'data/layers';

import getWidgetProps from './selectors';

const getOTFAnalysis = async (params) => {
  const analysis = new OTFAnalysis(params.geostore.id);
  analysis.setDates({
    startDate: params.startDate,
    endDate: params.endDate,
  });
  analysis.setData(['gain', 'extent'], params);

  return analysis.getData().then((response) => {
    const { gain, extent } = response;
    const totalGain = gain?.data?.[0]?.area__ha;
    const totalExtent = extent?.data?.[0]?.area__ha;

    return {
      gain: totalGain,
      extent: totalExtent,
    };
  });
};

export default {
  widget: 'treeCoverGainSimple',
  title: 'Tree cover gain in {location}',
  categories: ['summary', 'forest-change'],
  types: ['geostore', 'aoi', 'wdpa', 'use'],
  admins: ['adm0', 'adm1'],
  metaKey: 'widget_tree_cover_gain',
  settingsConfig: [
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density',
    },
  ],
  pendingKeys: ['threshold'],
  refetchKeys: ['threshold'],
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    // gain
    {
      dataset: FOREST_GAIN_DATASET,
      layers: [FOREST_GAIN],
    },
  ],
  visible: ['dashboard', 'analysis'],
  sortOrder: {
    summary: 3,
    forestChange: 7,
  },
  settings: {
    threshold: 30,
    extentYear: 2000,
  },
  chartType: 'listLegend',
  colors: 'gain',
  sentence:
    'From 2001 to 2020, {location} gained {gain} of tree cover equal to {gainPercent} is its total extent.',
  getData: (params) => {
    if (shouldQueryPrecomputedTables(params)) {
      return getGain(params).then((response) => {
        const { data } = (response && response.data) || {};
        const gain = (data[0] && data[0].gain) || 0;
        const extent = (data[0] && data[0].extent) || 0;

        return {
          gain,
          extent,
        };
      });
    }

    return getOTFAnalysis(params);
  },
  getDataURL: (params) => {
    return [getGain({ ...params, download: true })];
  },
  getWidgetProps,
};
