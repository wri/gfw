import { all, spread } from 'axios';
import compact from 'lodash/compact';

import tropicalIsos from 'data/tropical-isos.json';

import { getExtent, getLoss } from 'services/analysis-cached';
import { getYearsRangeFromMinMax } from 'components/widgets/utils/data';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_LOSS_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_LOSS,
} from 'data/layers';

import indonesiaPlaceholder from 'assets/images/indonesia-primary-forest-loss-2023.png';
import getWidgetProps from './selectors';

const MIN_YEAR = 2002;
const MAX_YEAR = 2023;

const getGlobalLocation = (params) => ({
  adm0: params.type === 'global' ? null : params.adm0,
  adm1: params.type === 'global' ? null : params.adm1,
  adm2: params.type === 'global' ? null : params.adm2,
});

export default {
  widget: 'treeLossPct',
  title: {
    default: 'Primary Forest loss in {location}',
    global: 'Global Primary Forest loss',
  },
  categories: ['summary', 'forest-change'],
  subcategories: ['forest-loss'],
  types: ['global', 'country', 'wdpa', 'aoi'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  alerts: [
    {
      text: 'The methods behind this data have changed over time. Be cautious comparing old and new data, especially before/after 2015. [Read more here](https://www.globalforestwatch.org/blog/data-and-research/tree-cover-loss-satellite-data-trend-analysis/).',
      visible: ['global', 'country', 'geostore', 'aoi', 'wdpa', 'use'],
    },
  ],
  large: true,
  visible: ['dashboard', 'analysis'],
  chartType: 'composedChart',
  colors: 'loss',
  settingsConfig: [
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true,
    },
    {
      key: 'years',
      label: 'years',
      endKey: 'endYear',
      startKey: 'startYear',
      type: 'range-select',
      border: true,
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density',
    },
  ],
  pendingKeys: ['threshold', 'years'],
  refetchKeys: ['landCategory', 'threshold'],
  dataType: 'lossPrimary',
  metaKey: 'widget_primary_forest_loss',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    // loss
    {
      dataset: FOREST_LOSS_DATASET,
      layers: [FOREST_LOSS],
    },
  ],
  sortOrder: {
    summary: -1,
    forestChange: -1,
  },
  sentence: {
    initial:
      'From {startYear} to {endYear}, <b>{location} lost {loss} of humid primary forest</b>, making up {percent} of its {total tree cover loss} in the same time period. <b>Total area of humid primary forest in {location} decreased by</b> {extentDelta} in this time period.',
    withIndicator:
      'From {startYear} to {endYear}, <b>{location} lost {loss} of humid primary forest</b> in {indicator}, making up {percent} of its {total tree cover loss} in the same time period. <b>Total area of humid primary forest in {location} in {indicator} decreased by</b> {extentDelta} in this time period.',
    globalInitial:
      'From {startYear} to {endYear}, there was a total of {loss} <b>humid primary forest lost</b> {location}, making up {percent} of its {total tree cover loss} in the same time period. Total area of humid primary forest decreased {location} by</b> {extentDelta} in this time period.',
    globalWithIndicator:
      'From {startYear} to {endYear}, there was a total of {loss} <b>humid primary forest lost</b> {location} within {indicator}, making up {percent} of its {total tree cover loss} in the same time period. <b>Total area of humid primary forest in {indicator} decreased {location} by</b> {extentDelta} in this time period.',
    noLoss:
      'From {startYear} to {endYear}, <b>{location} lost {loss} of humid primary forest</b>.',
    noLossWithIndicator:
      'From {startYear} to {endYear}, <b>{location} lost {loss} of humid primary forest</b> in {indicator}.',
  },
  settings: {
    threshold: 30,
    extentYear: 2000,
    forestType: 'primary_forest',
  },
  whitelists: {
    adm0: tropicalIsos,
  },
  placeholderImageURL: indonesiaPlaceholder,
  getData: (params = {}) => {
    const { adm0, adm1, adm2, type } = params || {};
    const globalLocation = {
      adm0: type === 'global' ? null : adm0,
      adm1: type === 'global' ? null : adm1,
      adm2: type === 'global' ? null : adm2,
    };

    return all([
      getLoss({
        ...params,
        forestType: null,
        landCategory: null,
        ...globalLocation,
      }),
      getLoss({ ...params, ...globalLocation }),
      getExtent({
        ...params,
        ...globalLocation,
      }),
      getLoss({ ...params, forestType: null, ...globalLocation }),
    ]).then(
      spread((adminLoss, primaryLoss, extent, loss) => {
        let data = {};
        if (
          adminLoss &&
          adminLoss.data &&
          primaryLoss &&
          primaryLoss.data &&
          loss &&
          loss.data &&
          extent &&
          extent.data
        ) {
          data = {
            adminLoss: adminLoss.data.data,
            loss: loss.data.data,
            primaryLoss: primaryLoss.data.data,
            extent: (loss.data.data && extent.data.data) || [],
          };
        }
        const { startYear, endYear, range } = getYearsRangeFromMinMax(
          MIN_YEAR,
          MAX_YEAR
        );
        return {
          ...data,
          settings: {
            startYear,
            endYear,
            yearsRange: range,
          },
          options: {
            years: range,
          },
        };
      })
    );
  },
  getDataURL: (params) => {
    const globalLocation = getGlobalLocation(params);
    return compact([
      getLoss({
        ...params,
        ...globalLocation,
        forestType: null,
        landCategory: null,
        download: true,
      }),
      getLoss({
        ...params,
        ...globalLocation,
        download: true,
      }),
      getExtent({ ...params, download: true }),
      params.landCategory &&
        getLoss({
          ...params,
          forestType: null,
          ...globalLocation,
          download: true,
        }),
    ]);
  },
  /**
   * set rules when the widget should only display a static image
   * see FLAG-829 for reference.
   * @param {{ adm0, adm1, adm2, locationType, pathname, type }, category }
   */
  // eslint-disable-next-line no-unused-vars
  isPlaceholderImage: ({ location, category }) => {
    return (
      location.type === 'country' &&
      location.adm0 === 'IDN' &&
      !location.pathname.includes('embed') &&
      (category === 'summary' || !category)
    );
  },
  getWidgetProps,
};
