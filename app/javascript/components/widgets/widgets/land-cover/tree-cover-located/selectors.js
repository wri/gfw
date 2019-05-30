import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getOptions = state => state.options || null;
const getIndicator = state => state.indicator || null;
const getLandCategory = state => state.landCategory || null;
const getForestType = state => state.forestType || null;
const getLocation = state => state.allLocation || null;
const getLocationsMeta = state => state.childLocationData || null;
const getLocationName = state => state.locationName || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentences;
const getTitle = state => state.config.title;

export const parseList = createSelector(
  [getData, getSettings, getLocation, getLocationsMeta, getColors],
  (data, settings, location, meta, colors) => {
    if (isEmpty(data) || isEmpty(meta)) return null;
    const dataMapped = [];
    data.forEach(d => {
      const regionMeta = meta.find(l => d.id === l.value);
      if (regionMeta) {
        const { payload, query, type } = location;
        dataMapped.push({
          label: (regionMeta && regionMeta.label) || '',
          extent: d.extent,
          percentage: d.percentage,
          value: settings.unit === 'ha' ? d.extent : d.percentage,
          path: {
            type,
            payload: {
              ...payload,
              type: 'country',
              ...(!payload.adm0 && {
                adm0: d.id
              }),
              ...(payload.adm1 && {
                adm2: d.id
              }),
              ...(payload.adm0 &&
                !payload.adm1 && {
                  adm1: d.id
                })
            },
            query: {
              ...(query && query),
              map: {
                ...(query &&
                  query.map && {
                    ...query.map,
                    canBound: true
                  })
              }
            }
          },
          color: colors.main
        });
      }
    });
    return sortByKey(dataMapped, 'extent', true);
  }
);

export const parseData = createSelector([parseList], data => {
  if (isEmpty(data)) return null;
  return sortByKey(uniqBy(data, 'label'), 'value', true);
});

export const parseSentence = createSelector(
  [
    parseList,
    parseData,
    getSettings,
    getOptions,
    getIndicator,
    getForestType,
    getLandCategory,
    getLocationName,
    getSentences
  ],
  (
    sortedList,
    data,
    settings,
    options,
    indicator,
    forestType,
    landCategory,
    locationName,
    sentences
  ) => {
    if (!data || !options || !locationName) return null;
    const {
      initial,
      hasIndicator,
      landCatOnly,
      globalInitial,
      globalWithIndicator,
      globalLandCatOnly,
      percInitial,
      percHasIndicator,
      percLandCatOnly,
      percGlobalInitial,
      percGlobalWithIndicator,
      percGlobalLandCatOnly,
      noCover
    } = sentences;
    const topRegion = (data.length && data[0]) || {};
    const totalExtent = sumBy(data, 'extent');
    const avgExtent = sumBy(data, 'extent') / data.length;
    const avgExtentPercentage = sumBy(data, 'percentage') / data.length;
    let percentileExtent = 0;
    let percentileLength = 0;
    while (
      percentileLength < sortedList.length &&
      percentileExtent / totalExtent < 0.5 &&
      percentileLength !== 10
    ) {
      percentileExtent += sortedList[percentileLength].extent;
      percentileLength += 1;
    }
    const topExtent = percentileExtent / (totalExtent || 0) * 100;

    const topRegionExtent =
      topRegion.extent < 1
        ? `${format('.3r')(topRegion.extent)}ha`
        : `${format('.3s')(topRegion.extent)}ha`;
    const aveRegionExtent =
      avgExtent < 1
        ? `${format('.3r')(avgExtent)}ha`
        : `${format('.3s')(avgExtent)}ha`;

    const topRegionPercent =
      topRegion.percentage < 0.1
        ? '< 0.1%'
        : `${format('.2r')(topRegion.percentage)}%`;
    const aveRegionPercent =
      avgExtentPercentage < 0.1
        ? '< 0.1%'
        : `${format('.2r')(avgExtentPercentage)}%`;

    const params = {
      location: locationName === 'global' ? 'Globally' : locationName,
      region: topRegion.label,
      indicator: indicator && indicator.label.toLowerCase(),
      percentage: topExtent ? `${format('.2r')(topExtent)}%` : '0%',
      year: settings.extentYear,
      value: settings.unit === '%' ? topRegionPercent : topRegionExtent,
      average: settings.unit === '%' ? aveRegionPercent : aveRegionExtent,
      count: percentileLength
    };

    let sentence = noCover;
    if (params.percentage !== '0%' && settings.unit === '%') {
      sentence = locationName === 'global' ? percGlobalInitial : percInitial;
      if (landCategory && !forestType) {
        sentence =
          locationName === 'global' ? percGlobalLandCatOnly : percLandCatOnly;
      } else if (indicator) {
        sentence =
          locationName === 'global'
            ? percGlobalWithIndicator
            : percHasIndicator;
      }
    } else if (params.percentage !== '0%' && settings.unit === 'ha') {
      sentence = locationName === 'global' ? globalInitial : initial;
      if (landCategory && !forestType) {
        sentence = locationName === 'global' ? globalLandCatOnly : landCatOnly;
      } else if (indicator) {
        sentence =
          locationName === 'global' ? globalWithIndicator : hasIndicator;
      }
    }
    return {
      sentence,
      params
    };
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationName],
  (title, name) => {
    let selectedTitle = title.initial;
    if (name === 'global') {
      selectedTitle = title.global;
    }
    return selectedTitle;
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
  title: parseTitle
});
