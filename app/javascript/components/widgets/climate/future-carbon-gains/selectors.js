import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { yearTicksFormatter } from 'components/widgets/utils/data';
import { formatNumber } from 'utils/format';

const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getLocationName = state => state.locationLabel || null;
const getSentences = state => state.sentences;
const getColors = state => state.colors || null;

export const parseData = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (isEmpty(data)) return null;
    const selectedData = data[settings.unit];
    const years = {};

    Object.keys(selectedData).forEach(key =>
      selectedData[key].forEach(obj => {
        years[obj.year] = {
          ...years[obj.year],
          [key]: obj.value * 1000000,
          year: obj.year
        };
      })
    );

    return Object.values(years);
  }
);

export const parseConfig = createSelector(
  [getData, getSettings, getColors],
  (data, settings, colors) => {
    if (isEmpty(data)) return null;
    const selectedData = data[settings.unit];
    const yKeys = {};
    Object.keys(selectedData).forEach((k, i) => {
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
    const unit = settings.unit === 'co2Gain' ? 'tCO₂' : 'tC';

    tooltip = tooltip.concat(
      Object.keys(selectedData)
        .map((k, i) => ({
          key: k,
          label: labels[k] ? labels[k] : k,
          color: colors.ramp && colors.ramp[i],
          unit,
          unitFormat: num => formatNumber({ num, unit: '' })
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
      unit,
      tooltip
    };
  }
);

export const parseSentence = createSelector(
  [getSettings, getLocationName, getSentences, parseData],
  (settings, location, sentences, parsedData) => {
    if (isEmpty(parsedData)) return null;
    const maxYear = parsedData[parsedData.length - 1];
    const amount = Object.values(maxYear).reduce(
      (acc, n) => acc + n,
      -maxYear.year
    );
    const variables = {
      cGain: 'carbon',
      co2Gain: 'CO₂'
    };
    const variable = variables[settings.unit];
    const { initial } = sentences;

    return {
      sentence: initial,
      params: {
        location,
        amount: formatNumber({ num: amount, unit: 't' }),
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
  config: parseConfig,
  sentence: parseSentence,
  title: parseTitle
});
