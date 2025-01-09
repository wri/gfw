import { createSelector, createStructuredSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';
import { formatNumber } from 'utils/format';

// get list data
const getData = (state) => state.data;
const getSettings = (state) => state.settings;
const getLocationData = (state) => state.locationData;
const getLocation = (state) => state.location;
const getColors = (state) => state.colors;
const getIndicator = (state) => state.indicator;
const getAdm0 = (state) => state.adm0;
const getAdm1 = (state) => state.adm1;
const getAdm2 = (state) => state.adm2;
const getSentences = (state) => state && state.sentence;
const getTitle = (state) => state.title;
const getLocationName = (state) => state.locationLabel;
const getParent = (state) => state.parent;

export const getSummedByYearsData = createSelector(
  [getData, getSettings, getAdm1, getAdm2],
  (data, settings, adm1, adm2) => {
    if (isEmpty(data)) return null;

    const { loss, extent } = data;
    const filteredByYears = loss.filter(
      (d) => d.year >= settings.startYear && d.year <= settings.endYear
    );

    let regionKey = 'iso';
    if (adm1) regionKey = 'adm1';
    if (adm2) regionKey = 'adm2';

    const groupedByRegion = groupBy(filteredByYears, regionKey);
    const regions = Object.keys(groupedByRegion);
    const mappedData = regions.map((region) => {
      const isoLoss = Math.round(sumBy(groupedByRegion[region], 'loss')) || 0;
      const regionExtent = extent.find((e) => {
        return e[regionKey]?.toString() === region.toString(); // iso is string while adm1 and 2 are numbers
      });
      const isoExtent = (regionExtent && regionExtent.extent) || 0;
      const percentageLoss =
        isoExtent && isoLoss ? (100 * isoLoss) / isoExtent : 0;

      return {
        id: adm1 ? parseInt(region, 10) : region,
        loss: isoLoss,
        extent: isoExtent,
        percentage: percentageLoss > 100 ? 100 : percentageLoss,
      };
    });

    return sortBy(
      uniqBy(mappedData, 'id'),
      settings.unit === 'ha' ? 'loss' : 'percentage'
    ).map((d, i) => ({
      ...d,
      rank: i + 1,
    }));
  }
);

export const sortData = createSelector(
  [getSummedByYearsData, getSettings],
  (data, settings) => {
    if (!data || !data.length) return null;
    return sortBy(
      uniqBy(data, 'id'),
      settings.unit === 'ha' ? 'loss' : 'percentage'
    ).reverse();
  }
);

export const parseData = createSelector(
  [sortData, getSettings, getAdm0, getLocation, getLocationData, getColors],
  (data, settings, adm0, location, parentData, colors) => {
    if (isEmpty(data)) return null;
    let dataTrimmed = [];

    data.forEach((d) => {
      const locationMeta = parentData && parentData[d.id];

      if (locationMeta) {
        dataTrimmed.push({
          ...d,
          label: locationMeta.label,
          path: locationMeta.path,
        });
      }
    });
    dataTrimmed = dataTrimmed.map((d, i) => ({
      ...d,
      rank: i + 1,
    }));
    if (adm0) {
      const locationIndex = findIndex(
        dataTrimmed,
        (d) => d.id === (location && location.value)
      );
      let trimStart = locationIndex - 2;
      let trimEnd = locationIndex + 3;
      if (locationIndex < 2) {
        trimStart = 0;
        trimEnd = 5;
      }
      if (locationIndex > dataTrimmed.length - 3) {
        trimStart = dataTrimmed.length - 5;
        trimEnd = dataTrimmed.length;
      }
      dataTrimmed = dataTrimmed.slice(trimStart, trimEnd);
    }
    return dataTrimmed.map((d) => ({
      ...d,
      color: colors.main,
      value: settings.unit === 'ha' ? d.loss : d.percentage,
    }));
  }
);

export const parseSentence = createSelector(
  [
    sortData,
    getSettings,
    getIndicator,
    getLocation,
    getSentences,
    getLocationData,
    getParent,
  ],
  (data, settings, indicator, location, sentences, meta, parent) => {
    if (!data || !data.length || !location) return null;
    const { startYear, endYear } = settings;
    const {
      initial,
      withIndicator,
      globalInitial,
      globalWithIndicator,
      noLoss,
    } = sentences;
    const locationData = location && data.find((l) => l.id === location.value);
    const isGlobal = location.label === 'global';
    const loss = locationData?.loss;
    const topRegionData = data[0];
    const topRegion = meta && topRegionData && meta[topRegionData.id];
    const globalLoss = sumBy(data, 'loss') || 0;
    const lossArea = isGlobal ? globalLoss : loss;
    const lossPercent = loss ? (100 * loss) / globalLoss : 0;
    const indicatorName = !indicator ? 'region-wide' : `${indicator.label}`;

    let sentence = !indicator ? initial : withIndicator;

    if (isGlobal) sentence = !indicator ? globalInitial : globalWithIndicator;
    if (loss === 0) sentence = noLoss;

    const params = {
      indicator: indicatorName,
      topLocationLabel: topRegion?.label,
      topLocationPerc:
        topRegionData &&
        formatNumber({ num: topRegionData.percentage, unit: '%' }),
      topLocationLoss:
        topRegionData &&
        formatNumber({ num: topRegionData.loss, unit: 'ha', spaceUnit: true }),
      location: isGlobal ? 'globally' : location?.label,
      indicator_alt: indicatorName,
      startYear,
      endYear,
      loss: formatNumber({ num: lossArea, unit: 'ha', spaceUnit: true }),
      localPercent: formatNumber({ num: locationData?.percentage, unit: '%' }),
      globalPercent: formatNumber({ num: lossPercent, unit: '%' }),
      extentYear: settings.extentYear,
      parent: parent?.label || null,
    };

    return {
      sentence,
      params,
    };
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationName],
  (title, name) => {
    let selectedTitle = title.default;
    if (name === 'global') {
      selectedTitle = title.global;
    }
    return selectedTitle;
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
  title: parseTitle,
});
