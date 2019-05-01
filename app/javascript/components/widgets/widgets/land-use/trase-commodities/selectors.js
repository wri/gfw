import { createSelector, createStructuredSelector } from 'reselect';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import capitalize from 'lodash/capitalize';
import { format } from 'd3-format';
import { sortByKey } from 'utils/data';
import { formatNumber } from 'utils/format';

// get list data
const getData = state => state.data && state.data;
const getDataSettings = state => state.data && state.data.settings;
const getSettings = state => state.settings;
const getLocationObject = state => state.locationObject;
const getLocationName = state => state.locationName;
const getColors = state => state.colors;
const getSentences = state => state.config.sentence;
// this allows us to get options from the fetch
export const getDataOptions = state => state.data && state.data.options;

export const parseData = createSelector(
  [getData, getColors],
  (data, colors) => {
    if (isEmpty(data)) return null;
    const list = data.data.targetNodes;
    const rankedList = list.map(l => ({
      label: capitalize(l.name),
      value: l.value,
      id: l.id,
      percentage: l.height,
      unit: data.data.unit,
      iso: l.geo_id,
      color: colors.main
    }));
    return {
      ...data,
      rankedData: rankedList
    };
  }
);

export const parseSentence = createSelector(
  [parseData, getSentences, getSettings, getLocationName],
  (data, sentence, settings, locationName) => {
    if (!data) return null;
    const { startYear, endYear, commodity } = settings;
    const topLocation = data.rankedData[0];
    const params = {
      startYear,
      endYear,
      commodity: `${locationName} ${commodity}`,
      source: topLocation.label,
      volume: formatNumber({ num: topLocation.value, unit: 't' }),
      percentage: formatNumber({ num: topLocation.percentage, unit: '%' }),
      location: locationName
    }

    return {
      sentence,
      params
    }
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
  settings: getDataSettings
});
