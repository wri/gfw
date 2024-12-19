import { createSelector, createStructuredSelector } from 'reselect';
import { formatNumber } from 'utils/format';

// get list data
const getGain = (state) => state.data && state.data.gain;
const getExtent = (state) => state.data && state.data.extent;
const getSentence = (state) => state.sentence;
const getLocationName = (state) => state.locationLabel;
const getColors = (state) => state.colors;
const getSettings = (state) => state.settings;

export const parseSentence = createSelector(
  [getGain, getExtent, getSentence, getLocationName, getSettings],
  (gain, extent, sentence, location, settings) => {
    if (!gain && !extent) return null;
    const gainPerc = (gain && extent && (gain / extent) * 100) || 0;
    const { baselineYear: dateFromDashboard, startYear: dateFromMapLayer } =
      settings;

    const params = {
      gain: formatNumber({ num: gain, unit: 'ha', spaceUnit: true }),
      gainPercent: formatNumber({ num: gainPerc, unit: '%' }),
      location,
      baselineYear: dateFromMapLayer || dateFromDashboard || 2000,
    };

    return {
      sentence,
      params,
    };
  }
);

export const parseData = createSelector(
  [getGain, getExtent, getColors],
  (gain, extent, colors) => {
    if (!gain || !extent) return null;
    const gainPerc = (gain && extent && (gain / extent) * 100) || 0;

    return [
      {
        label: 'Tree cover gain',
        value: gain,
        color: colors.main,
        percentage: gainPerc,
      },
    ];
  }
);

export default createStructuredSelector({
  sentence: parseSentence,
  data: parseData,
});
