import moment from 'moment';
import { find } from 'lodash';

const AVAILABLE_DATE_RANGES = [
  {
    start: moment()
      .subtract(7, 'days')
      .utc(),
    end: moment().utc(),
    label: 'past week',
    duration: 24 * 7
  },
  {
    start: moment()
      .subtract(3, 'days')
      .utc(),
    end: moment().utc(),
    label: 'past 72 hours',
    duration: 72
  },
  {
    start: moment()
      .subtract(2, 'days')
      .utc(),
    end: moment().utc(),
    label: 'past 48 hours',
    duration: 48
  },
  {
    start: moment()
      .subtract(1, 'days')
      .utc(),
    end: moment().utc(),
    label: 'past 24 hours',
    duration: 24
  }
];

export function getRangeForDates(dates, range) {
  const duration = moment(dates[1]).diff(moment(dates[0]), 'hours');
  const dateRange = find(range || AVAILABLE_DATE_RANGES, duration);

  return dateRange ? [dateRange.start, dateRange.end] : [dates[0], dates[1]];
}
