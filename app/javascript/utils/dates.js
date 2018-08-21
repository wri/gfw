import moment from 'moment';
import find from 'lodash/find';
import compact from 'lodash/compact';

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

export const addToDate = (date, count, interval = 'days') => {
  const result = new Date(date);
  if (interval === 'years') {
    result.setFullYear(result.getFullYear() + count);
  } else if (interval === 'months') {
    result.setMonth(result.getMonth() + count);
  } else if (interval === 'days') {
    result.setDate(result.getDate() + count);
  }
  return result;
};

export const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date);
  let month = null;
  let day = null;
  const year = d.getFullYear();

  if (format.includes('MM')) {
    month = (d.getMonth() + 1).toString();
    if (month.length < 2) month = `0${month}`;
  }

  if (format.includes('DD')) {
    day = d.getDate().toString();
    if (day.length < 2) day = `0${day}`;
  }

  return compact([year, month, day]).join('-');
};

export const getYear = date => new Date(date).getUTCFullYear();

export const formatDatePretty = (date, dateFormat) => {
  const d = new Date(date);
  const hasDays = dateFormat.includes('DD');
  const hasMonths = dateFormat.includes('MM');
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEPT',
    'OCT',
    'NOV',
    'DEC'
  ];
  let day = d.getDate().toString();
  const month = d.getMonth();
  const year = d.getFullYear();

  if (day.length < 2) day = `0${day}`;

  return `${hasDays ? `${day} ` : ''}${hasMonths ? `${months[month]} ` : ''}${
    year
  }`;
};

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
export const dateDiffInDays = (startDate, endDate) => {
  const a = new Date(endDate);
  const b = new Date(startDate);
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};
