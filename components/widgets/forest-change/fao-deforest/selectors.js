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

    let dataTrimmed = [];
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

      dataTrimmed = rank.slice(trimStart, trimEnd);
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
  [getData, getLocationName, getSettings, getSentences],
  (data, currentLabel, settings, sentences) => {
    if (!data || !data.fao) return null;
    const { initial, noDeforest, humanDeforest, globalInitial, globalHuman } =
      sentences;

    const topFAOByDeforestation = data.fao.rows
      ?.filter((regionData) => regionData.year === settings.yearRange)
      .sort((a, b) => Number(b.deforest) - Number(a.deforest));

    const { deforest, humdef } = topFAOByDeforestation[0] || {};
    const totalDeforest = sumBy(data.rank, 'deforest') || 0;
    const rate = currentLabel === 'global' ? totalDeforest : deforest;

    let sentence = humdef ? humanDeforest : initial;
    if (currentLabel === 'global') {
      sentence = humdef ? globalHuman : globalInitial;
    } else if (!deforest) sentence = noDeforest;

    const rateFormat = rate < 1 ? '.3r' : '.3s';
    const humanFormat = humdef < 1 ? '.3r' : '.3s';

    const params = {
      location: currentLabel,
      year: settings.yearRange,
      yearRange: settings.yearRange,
      rate: formatNumber({
        num: rate,
        unit: 'ha',
        spaceUnit: true,
        specialSpecifier: rateFormat,
      }),
      human: formatNumber({
        num: humdef,
        unit: 'ha',
        spaceUnit: true,
        specialSpecifier: humanFormat,
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
