import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { yearTicksFormatter } from 'components/widgets/utils/data';

const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getLocationName = state => state.locationName || null;
const getSentences = state => state.config && state.config.sentences;
const getColors = state => state.colors || null;

export const parseData = createSelector([getData], data => {
  if (isEmpty(data)) return null;
  const years = {};
  Object.keys(data).forEach(key =>
    data[key].values.forEach(obj => {
      if (years[obj.year]) years[obj.year][key] = obj.value;
      else years[obj.year] = { year: obj.year, [key]: obj.value };
    })
  );
  return Object.values(years);
});

export const parseConfig = createSelector(
  [getData, getColors],
  (data, colors) => {
    if (isEmpty(data)) return null;
    const categoryColors = colors.lossDrivers;
    const yKeys = {};
    Object.keys(data).forEach((k, i) => {
      yKeys[k] = {
        fill: categoryColors[i + 1],
        stackId: 1
      };
    });
    let tooltip = [
      {
        key: 'year'
      }
    ];
    const labels = {
      YSF: 'Young Secondary Forest',
      MASF: 'Mid-Age Secondary Forests'
    };
    tooltip = tooltip.concat(
      Object.keys(data)
        .map((k, i) => ({
          key: k,
          label: labels[k] ? labels[k] : k,
          color: categoryColors[i + 1]
          // unit: 'ha',
          // unitFormat: value => format('.3s')(value || 0)
        }))
        .reverse()
    );
    return {
      height: 250,
      xKey: 'year',
      yKeys: {
        bars: yKeys
      },
      xAxis: {
        ticksFormatter: yearTicksFormatter
      },
      tooltip
    };
  }
);

export const parseSentence = createSelector(
  [getSettings, getLocationName, getSentences],
  sentences => {
    const { initial } = sentences;
    const params = {};

    return {
      sentence: initial,
      params
    };
  }
);

export const parseTitle = createSelector(
  [],
  () => 'Potential tree biomass gain'
);

export default createStructuredSelector({
  data: parseData,
  dataConfig: parseConfig,
  sentence: parseSentence,
  title: parseTitle
});
