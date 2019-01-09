import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { yearTicksFormatter } from 'components/widgets/utils/data';
import { formatNumber } from 'utils/format';

const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getLocationName = state => state.locationName || null;
const getSentences = state => state.config && state.config.sentences;
const getColors = state => state.colors || null;

export const parseData = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (isEmpty(data)) return null;
    const years = {};
    const selected = data[settings.unit];
    Object.keys(selected).forEach(key =>
      selected[key].forEach(obj => {
        if (years[obj.year]) years[obj.year][key] = obj.value;
        else years[obj.year] = { year: obj.year, [key]: obj.value };
      })
    );
    return Object.values(years);
  }
);

export const parseConfig = createSelector(
  [getData, getSettings, getColors],
  (data, settings, colors) => {
    if (isEmpty(data)) return null;
    const yKeys = {};
    Object.keys(data[settings.unit]).forEach((k, i) => {
      yKeys[k] = {
        fill: colors.ramp && colors.ramp[i],
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
          color: colors.ramp && colors.ramp[i]
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
  [getSettings, getLocationName, getSentences, parseData],
  (settings, location, sentences, data) => {
    if (isEmpty(data)) return null;
    const maxYear = data[data.length - 1];
    const amount = Object.values(maxYear).reduce(
      (acc, n) => acc + n,
      -maxYear.year
    );
    const variables = {
      cGain: 'carbon',
      co2Gain: 'carbon dioxide'
    };
    const variable = variables[settings.unit];
    const { initial } = sentences;

    return {
      sentence: initial,
      params: {
        location,
        amount: formatNumber({ num: amount * 1000000, unit: 't' }),
        variable,
        maxYear: maxYear.year
      }
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
