import { createSelector } from 'reselect';
import moment from 'moment';
import range from 'lodash/range';

import { dateDiffInDays } from 'utils/dates';

const getDates = state => state.dates;

export const getDatesAsNumbers = createSelector(getDates, dates => {
  if (!dates) return null;
  const { minDate, maxDate, startDate, endDate, trimEndDate } = dates;
  return {
    min: 0,
    max: dateDiffInDays(maxDate, minDate),
    start: dateDiffInDays(startDate, minDate),
    end: dateDiffInDays(endDate, minDate),
    trim: dateDiffInDays(trimEndDate, minDate)
  };
});

export const getTicks = createSelector(getDates, dates => {
  if (!dates) return null;
  const { minDate, maxDate } = dates;
  const numOfYears = moment(maxDate).diff(minDate, 'years');
  const maxDays = moment(maxDate).diff(minDate, 'days');
  const ticks = range(
    0,
    maxDays + 1,
    maxDays / (numOfYears > 5 ? 5 : numOfYears)
  );
  const marks = {};
  ticks.forEach(r => {
    marks[Math.floor(r)] = moment(minDate)
      .add(r, 'days')
      .format('YYYY');
  });
  return marks;
});
