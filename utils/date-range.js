import moment from 'moment';

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

  // User selects dates that are either before or after the comparison date
  // example: pos=0 start (after) end date
  // or : pos=2 start end date (before start)
  if (diffInterval < 0) {
    if (position === 0) {
      newRange[2] = date.add('months', 1).format('YYYY-MM-DD');
    } else {
      newRange[0] = date.subtract('months', 1).format('YYYY-MM-DD');
    }
  } else if (maxRange && diffInterval > maxRange) {
    // User reached above our max range
    // If this does not happen, we simply ignore all checks below as we now ignore "min" date
    let modDate;
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
