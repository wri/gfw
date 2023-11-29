import { createSelector, createStructuredSelector } from 'reselect';
import findIndex from 'lodash/findIndex';
import sumBy from 'lodash/sumBy';
import { formatNumber } from 'utils/format';

const getData = (state) => state.data;
const getAdm0 = (state) => state.adm0;
const getLocationName = (state) => state.locationLabel;
const getColors = (state) => state.colors;
const getSettings = (state) => state.settings;
const getSentences = (state) => state.sentences;
const getTitle = (state) => state.title;

export const parseData = createSelector(
  [getData, getAdm0, getColors],
  (data, adm0, colors) => {
    if (!data || !data.rank) return null;
    const { rank } = data;

    let dataTrimmed = rank;

    dataTrimmed = dataTrimmed.map((d, i) => ({
      ...d,
      rank: i + 1,
    }));

    if (adm0) {
      const locationIndex = findIndex(rank, (d) => d.iso === adm0);

      let trimStart = locationIndex - 2;
      let trimEnd = locationIndex + 3;

      if (locationIndex < 2) {
        trimStart = 0;
        trimEnd = 5;
      }

      if (locationIndex > rank.length - 3) {
        trimStart = rank.length - 5;
        trimEnd = rank.length;
      }

      dataTrimmed = dataTrimmed.slice(trimStart, trimEnd);
    }

    return dataTrimmed.map((d) => ({
      ...d,
      label: d.country,
      color: colors.main,
      value: d.def_per_year,
    }));
  }
);

export const parseSentence = createSelector(
  [getData, getLocationName, getSettings, getSentences, getAdm0],
  (data, currentLabel, settings, sentences, adm0) => {
    if (!data || !data.fao) return null;

    const { initial, noDeforest, globalInitial } = sentences;
    const topFAOByDeforestation = data.fao.rows
      ?.filter((regionData) => regionData.year === settings.yearRange)
      .sort((a, b) => Number(b.deforest) - Number(a.deforest));

    const yearRangeSeparated = settings.yearRange.split('-');
    const startYearRange = yearRangeSeparated[0];
    const endYearRange = yearRangeSeparated[1];

    const { deforest } = topFAOByDeforestation[0] || {};
    const globalDeforestation = sumBy(data.rank, 'def_per_year') || 0;
    const countryDeforestation = data.rank.filter(
      (country) => country.iso === adm0
    )[0].def_per_year;
    const rate =
      currentLabel === 'global' ? globalDeforestation : countryDeforestation;
    const rateFormat = rate < 1 ? '.3r' : '.3s';

    let sentence = initial;

    if (currentLabel === 'global') {
      sentence = globalInitial;
    }

    if (!deforest) {
      sentence = noDeforest;
    }

    const params = {
      location: currentLabel,
      year: settings.yearRange,
      startYearRange,
      endYearRange,
      rate: formatNumber({
        num: rate,
        unit: 'ha',
        spaceUnit: true,
        specialSpecifier: rateFormat,
      }),
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
  title: parseTitle,
});
