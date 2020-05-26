import { createSelector, createStructuredSelector } from 'reselect';
import moment from 'moment';
import { format } from 'd3-format';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';

import { getChartConfig } from 'components/widgets/utils/data';

const getAlerts = state => state.data;
const getColors = state => state.colors || null;
const getStartDate = state => state.settings.startDate;
const getEndDate = state => state.settings.endDate;
const getSentences = state => state.sentence || null;
const getLocationObject = state => state.location;
const getOptionsSelected = state => state.optionsSelected;

export const getData = createSelector(
  [getAlerts],
  (data) => {
    if (!data || isEmpty(data)) return null;

    return sortBy(data.map(d => ({
      ...d,
      date: d.alert__date
    })), 'date');
  }
);

export const parseConfig = createSelector(
  [getColors, getStartDate, getEndDate],
  (colors, startDate, endDate) => {
    const tooltip = [
      {
        label: 'Fire alerts'
      },
      {
        key: 'count',
        labelKey: 'alert__date',
        labelFormat: value => moment(value).format('YYYY-MM-DD'),
        unit: ' VIIRS alerts',
        color: colors.main,
        unitFormat: value =>
          (Number.isInteger(value) ? format(',')(value) : value)
      }
    ];

    return {
      ...getChartConfig(colors),
      tooltip,
      xAxis: {
        ticks: [startDate, endDate],
        interval: 0,
        padding: { left: 20, right: 20 },
        tickFormatter: t => moment(t).format('MMM YYYY')
      }
    };
  }
);

export const parseSentence = createSelector(
  [
    getData,
    getColors,
    getSentences,
    getLocationObject,
    getStartDate,
    getEndDate,
    getOptionsSelected
  ],
  (data, colors, sentence, location, startDate, endDate, options) => {
    if (!data) return null;
    const { dataset } = options;
    const total = sumBy(data, 'alert__count');
    const params = {
      location: location.label || '',
      start_date: moment(startDate).format('Do of MMMM YYYY'),
      end_date: moment(endDate).format('Do of MMMM YYYY'),
      dataset: dataset && dataset.label,
      total_alerts: {
        value: total ? format(',')(total) : 0,
        color: colors.main
      }
    };
    return { sentence, params };
  }
);

export default createStructuredSelector({
  data: getData,
  config: parseConfig,
  sentence: parseSentence
});
