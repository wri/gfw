import { createSelector, createStructuredSelector } from 'reselect';
import sumBy from 'lodash/sumBy';
import uniqBy from 'lodash/uniqBy';
import { formatNumber } from 'utils/format';
import { getColorPalette } from 'components/widgets/utils/colors';
import { zeroFillYearsFilter } from 'components/widgets/utils/data';

// get list data
const getTotalLoss = (state) => state.data && state.data.totalLoss;
const getSettings = (state) => state.settings;
const getLocationName = (state) => state.locationLabel;
const getTitle = (state) => state.title;
const getColors = (state) => state.colors;
const getSentence = (state) => state.sentence;
const getAdminLevel = (state) => state.adminLevel;

// get lists selected
export const parseData = createSelector(
  [getTotalLoss, getSettings],
  (totalLoss, settings) => {
    if (!totalLoss) return null;
    const { startYear, endYear, yearsRange } = settings;
    const years = yearsRange && yearsRange.map((yearObj) => yearObj.value);
    const fillObj = {
      area: 0,
      biomassLoss: 0,
      bound1: null,
      emissions: 0,
      percentage: 0,
    };
    const zeroFilledData = zeroFillYearsFilter(
      totalLoss,
      startYear,
      endYear,
      years,
      fillObj
    );

    const mappedData = zeroFilledData.map((list) => {
      const naturalForestList = list.filter(
        (item) => item.sbtn_natural_forests__class === 'Natural Forest'
      );

      const nonNaturalForestList = list.filter(
        (item) => item.sbtn_natural_forests__class === 'Non-Natural Forest'
      );
      // eslint-disable-next-line no-unused-vars
      const unknownList = list.filter(
        (item) => item.sbtn_natural_forests__class === 'Unknown'
      );

      const naturalForestArea = naturalForestList?.reduce(
        (acc, curr) => acc + curr.area,
        0
      );
      const naturalForestEmissions = naturalForestList?.reduce(
        (acc, curr) => acc + curr.emissions,
        0
      );
      const nonNaturalForestArea = nonNaturalForestList?.reduce(
        (acc, curr) => acc + curr.area,
        0
      );
      const nonNaturalForestEmissions = nonNaturalForestList?.reduce(
        (acc, curr) => acc + curr.emissions,
        0
      );

      return {
        iso: nonNaturalForestList[0]?.iso || '',
        outsideAreaLoss: naturalForestArea || 0,
        outsideCo2Loss: naturalForestEmissions || 0,
        areaLoss: nonNaturalForestArea || 0,
        co2Loss: nonNaturalForestEmissions || 0,
        totalLoss: (nonNaturalForestArea || 0) + (naturalForestArea || 0),
        year: nonNaturalForestList[0]?.year || '',
      };
    });

    const parsedData = uniqBy(mappedData, 'year');

    return parsedData;
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationName],
  (title, name) => {
    return name === 'global' ? title.global : title.default;
  }
);

export const parseConfig = createSelector([getColors], (colors) => {
  const colorRange = getColorPalette(colors.ramp, 2);
  return {
    height: 250,
    xKey: 'year',
    yKeys: {
      bars: {
        areaLoss: {
          fill: colorRange[0],
          stackId: 1,
        },
        outsideAreaLoss: {
          fill: colorRange[1],
          stackId: 1,
        },
      },
    },
    unit: 'ha',
    tooltip: [
      {
        key: 'year',
      },
      {
        key: 'totalLoss',
        label: 'Total',
        unitFormat: (value) =>
          formatNumber({ num: value, unit: 'ha', spaceUnit: true }),
      },
      {
        key: 'outsideAreaLoss',
        label: 'Natural forest',
        color: colorRange[1],
        unitFormat: (value) =>
          formatNumber({ num: value, unit: 'ha', spaceUnit: true }),
      },
      {
        key: 'areaLoss',
        label: 'Non-natural tree cover',
        color: colorRange[0],
        unitFormat: (value) =>
          formatNumber({ num: value, unit: 'ha', spaceUnit: true }),
      },
    ],
  };
});

export const parseSentence = createSelector(
  [parseData, getSettings, getLocationName, getSentence, getAdminLevel],
  (data, settings, locationName, sentences, admLevel) => {
    if (!data) return null;
    const { startYear, endYear } = settings;
    const totalLoss = sumBy(data, 'totalLoss') || 0;
    const outsideLoss = sumBy(data, 'outsideAreaLoss') || 0;
    const outsideEmissions = sumBy(data, 'outsideCo2Loss') || 0;
    const sentenceSubkey = admLevel === 'global' ? 'global' : 'region';
    const sentence = sentences[sentenceSubkey];

    const lossPhrase = 'natural forest';
    const percentage = (100 * outsideLoss) / totalLoss;
    const params = {
      location: locationName,
      startYear,
      endYear,
      lossPhrase,
      value: formatNumber({
        num: outsideEmissions,
        unit: 't',
        spaceUnit: true,
      }),
      percentage: formatNumber({ num: percentage, unit: '%' }),
      totalLoss: formatNumber({ num: outsideLoss, unit: 'ha' }), // using outsideLoss (natural forest) value based on Michelle's feedback
    };

    return {
      sentence,
      params,
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  config: parseConfig,
  sentence: parseSentence,
  title: parseTitle,
});
