import { createSelector, createStructuredSelector } from 'reselect';

import { formatNumber } from 'utils/format';

const getData = (state) => state.data;
const getSettings = (state) => state.settings;
const getColors = (state) => state.colors;
const getLocation = (state) => state.locationLabel;
const getSentences = (state) => state.sentences;
const getIndicator = (state) => state.indicator;
const getAdminLevel = (state) => state.adminLevel;
const getTitle = (state) => state.title;

export const parseTitle = createSelector(
  [getTitle, getAdminLevel],
  (title, adminLevel) => (adminLevel === 'global' ? title.global : title.region)
);

export const parseSentence = createSelector(
  [
    getData,
    getLocation,
    getSentences,
    getAdminLevel,
    getIndicator,
    getSettings,
  ],
  (data, locationName, sentences, adminLevel, indicator, settings) => {
    if (!data) return null;

    const sentence = (() => {
      switch (adminLevel) {
        case 'global':
          return indicator
            ? sentences.globalWithIndicator
            : sentences.globalInitial;
        default:
          return indicator
            ? sentences.regionWithIndicator
            : sentences.regionInitial;
      }
    })();

    const { baselineYear: dateFromDashboard, startYear: dateFromMapLayer } =
      settings;

    const params = {
      location: locationName,
      indicator: indicator && indicator.label,
      startYear: settings.startYear,
      endYear: settings.endYear,
      baselineYear: dateFromMapLayer || dateFromDashboard || 2000,
      gainPercent: formatNumber({
        num: (100 * data?.areaOutsidePlantations) / data?.totalArea,
        unit: '%',
      }),
    };

    return { sentence, params };
  }
);

export const parseData = createSelector(
  [getData, getColors],
  (data, colors) => {
    if (!data) return null;

    const outsidePlantationsPercent =
      (100 * data?.areaOutsidePlantations) / data?.totalArea;
    const withinPlantationsPercent = 100 - outsidePlantationsPercent;

    return [
      {
        label: 'Tree cover gain outside plantations',
        color: colors.outsidePlantations,
        value: data?.areaOutsidePlantations,
        percentage: outsidePlantationsPercent,
      },
      {
        label: 'Tree cover gain within plantations',
        color: colors.withinPlantations,
        value: data?.areaWithinPlantations,
        percentage: withinPlantationsPercent,
      },
    ];
  }
);

export default createStructuredSelector({
  title: parseTitle,
  sentence: parseSentence,
  data: parseData,
});
