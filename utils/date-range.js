import moment from 'moment';

const invalidDateRange = (date, range, position) => {
  const [start, end] = range;

  if (position === 0 && moment(date).isAfter(end)) {
    return true;
  }

  if (position === 2 && moment(date).isBefore(start)) {
    return true;
  }

  return false;
};

const setRange = (
  absolute,
  startDateAbsolute,
  endDateAbsolute,
  startDate,
  endDate,
  trimEndDate
) => {
  return absolute
    ? [startDateAbsolute, endDateAbsolute, endDateAbsolute]
    : [startDate, endDate, trimEndDate];
};

export const dateRange = (
  {
    startDate,
    endDate,
    trimEndDate,
    startDateAbsolute,
    endDateAbsolute,
    rangeInterval,
    maxRange,
    minDate,
    maxDate,
  },
  date,
  position,
  absolute
) => {
  const newRange = setRange(
    absolute,
    startDateAbsolute,
    endDateAbsolute,
    startDate,
    endDate,
    trimEndDate
  );

  newRange[position] = date.format('YYYY-MM-DD');
  if (position) {
    newRange[position - 1] = date.format('YYYY-MM-DD');
  }

  const diffInterval = moment(newRange[2]).diff(
    moment(newRange[0]),
    rangeInterval
  );

  let modDate;
  const isInvalidDateRange = invalidDateRange(date, newRange, position);
  const aboveMaxRange = maxRange && diffInterval > maxRange;
  // User selects dates that are either before or after the comparison date
  // example: pos=0 start (after) end date
  // or : pos=2 start end date (before start)
  if (isInvalidDateRange) {
    if (position === 0) {
      modDate = date.add('months', 1);
      newRange[2] = modDate.isAfter(maxDate)
        ? maxDate
        : modDate.format('YYYY-MM-DD');
    } else {
      modDate = date.subtract('months', 1);
      newRange[0] = modDate.isBefore(minDate)
        ? minDate
        : modDate.format('YYYY-MM-DD');
    }
  } else if (aboveMaxRange) {
    // User reached above our max range
    // If this does not happen, we simply ignore all checks below as we now ignore "min" date
    if (position === 0) {
      modDate = date.add(maxRange, rangeInterval);
      const outsideMaxDate = modDate.isAfter(moment(maxDate));
      const outsideEndDate = modDate.isAfter(moment(newRange[2]));
      if (outsideMaxDate) {
        newRange[2] = maxDate;
      } else if (outsideEndDate) {
        newRange[2] = moment(newRange[2]).subtract('days', 1);
      } else {
        newRange[2] = modDate.format('YYYY-MM-DD');
      }
    } else {
      modDate = date.subtract(maxRange, rangeInterval);
      const outsideMinDate = modDate.isBefore(moment(minDate));
      const outsideStartDate = modDate.isBefore(moment(newRange[0]));
      if (outsideMinDate) {
        newRange[0] = minDate;
      } else if (outsideStartDate) {
        newRange[0] = moment(newRange[0]).add('days', 1);
      } else {
        newRange[0] = modDate.format('YYYY-MM-DD');
      }
    }
  }

  return newRange;
};
