import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { formatNumber } from 'utils/format';
import { aboveGroundToBelowGround } from 'utils/calculations';

const getData = state => state.data;
const getLocationName = state => state.locationLabel;
const getColors = state => state.colors;
const getSentences = state => state.sentences;
const getTitle = state => state.title;
const getSettings = state => state.settings;

export const calculateData = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (isEmpty(data)) return null;
    const { variables } = settings;
    const soil =
      (data && data.soilCarbon && data.soilCarbon[settings.variable]) || 0;
    const aboveGround =
      (data && data.aboveGround && data.aboveGround[settings.variable]) || 0;
    const aboveGroundCarbon = aboveGround * 0.5;
    const belowGround = aboveGroundToBelowGround(aboveGround) * 0.5;
    const total = soil + aboveGroundCarbon + belowGround;
    const activeVariable =
      variables && variables.find(v => v.value === settings.variable);
    const { unit } = activeVariable || {};

    return {
      soil,
      aboveGround: aboveGroundCarbon,
      belowGround,
      total,
      unit
    };
  }
);

export const parseData = createSelector(
  [calculateData, getColors, getSettings],
  (data, colors, settings) => {
    if (isEmpty(data)) return null;
    const { soil, aboveGround, belowGround, total } = data || {};
    const { variable } = settings;
    const unit = variable === 'totalbiomass' ? 't' : 't/Ha';
    return [
      {
        label: 'Soil carbon',
        value: soil,
        unit,
        color: colors.carbon[0],
        percentage: soil / total * 100
      },
      {
        label: 'Above ground carbon',
        value: aboveGround,
        unit,
        color: colors.carbon[1],
        percentage: aboveGround / total * 100
      },
      {
        label: 'Below ground carbon',
        value: belowGround,
        unit,
        color: colors.carbon[2],
        percentage: belowGround / total * 100
      }
    ];
  }
);

export const parseSentence = createSelector(
  [calculateData, getLocationName, getSentences, getSettings],
  (data, locationName, sentence, settings) => {
    if (!data) return null;
    const { variable } = settings;
    const { soil, aboveGround, belowGround, total } = data || {};
    const allGround = aboveGround + belowGround;
    const unit = variable === 'totalbiomass' ? 't' : 't/Ha';
    const params = {
      location: locationName,
      carbonStored: allGround > soil ? 'biomass' : 'soil',
      carbonValue: formatNumber({ num: total, unit })
    };

    return {
      sentence,
      params
    };
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationName],
  (title, location) => title.replace('{location}', location)
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
  title: parseTitle
});
