import moment from 'moment';

export const addToDate = (date, count, interval = 'days', toEnd) => {
  const d = moment.utc(date);

  return toEnd ? d.add(count, interval).endOf(interval) : d.add(count, interval);
};

export const formatDate = (date, format = 'YYYY-MM-DD') => {
  return moment.utc(date).format(format);
};

export const formatDatePretty = (date, dateFormat = 'YYYY-MM-DD') => {
  const d = moment.utc(date);
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
  const day = d.format('DD');
  const month = d.month();
  const year = d.year();

  return `${hasDays ? `${day} ` : ''}${hasMonths ? `${months[month]} ` : ''}${
    year
  }`;
};

// startDate and endDate are string dates
export const dateDiff = (startDate, endDate, interval) => {
  const diff = moment.utc(endDate).diff(moment.utc(startDate), interval);

  return diff * -1
};

export const getTicks = (timelineConfig = {}) => {
  const { minDate, maxDate, interval, marks, dateFormat } = timelineConfig;

  // If user defines their own markers let's parse them if he pass a date as a value
  if (marks) {
    const newMarks = Object.keys(marks).reduce((acc, m) => {
      if (typeof m === 'string') {
        const key = moment.utc(m).diff(moment.utc(minDate), interval);

        return {
          ...acc,
          [key]: marks[m]
        }
      }

      return {
        ...acc,
        [m]: marks[m]
      }
    }, {});

    return newMarks;
  }


  // Otherwise, let's add default marks at the begginig and the end
  const minMark = 0;
  const maxMark = moment.utc(maxDate).diff(moment.utc(minDate), interval);

  const newMarks = {
    [minMark]: {
      label: moment.utc(minDate).format(dateFormat)
    },
    [maxMark]: {
      label: moment.utc(maxDate).format(dateFormat)
    }
  };

  return newMarks;
};

// startDate and endDate are string dates
export const gradientConverter = (gradient, minDate, interval) => (
  Object
    .keys(gradient)
    .reduce((acc, val) => ({
      ...acc,
      [dateDiff(val, minDate, interval)]: gradient[val],
    }), {})
);
