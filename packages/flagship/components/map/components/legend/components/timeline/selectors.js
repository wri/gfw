import { createSelector } from 'reselect';
import moment from 'moment';
import range from 'lodash/range';

const getDates = state => state.dates;

export const getMarks = createSelector(getDates, dates => {
  if (!dates) return null;
  const { minDate, maxDate } = dates;
  const numOfYears = moment(maxDate).diff(minDate, 'years');
  const maxDays = moment(maxDate).diff(minDate, 'days');

  if (!numOfYears || maxDays <= 365) return null;

  const ticks = range(
    0,
    maxDays + 1,
    maxDays / (numOfYears > 6 ? 6 : numOfYears)
  );
  const marks = {};
  ticks.forEach(r => {
    marks[Math.floor(r)] = moment(minDate)
      .add(r, 'days')
      .format('YYYY');
  });
  return marks;
});
