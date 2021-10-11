import { createSelector } from 'reselect';
import moment from 'moment';
import range from 'lodash/range';

const getDates = (state) => state.dates;
export const getMarks = createSelector(getDates, (dates) => {
  if (!dates) return null;
  const { minDate, maxDate, dynamicTimeline = false } = dates;
  const numOfYears = moment(maxDate).diff(minDate, 'years');
  const maxDays = moment(maxDate).diff(minDate, 'days');

  if (!numOfYears || maxDays <= 365) return null;

  const marks = {};

  let ticks = range(
    0,
    maxDays + 1,
    maxDays / (numOfYears > 6 ? 6 : numOfYears)
  );

  if (dynamicTimeline) {
    ticks = [0, maxDays / 2, maxDays];
    ticks.forEach((r) => {
      marks[Math.floor(r)] = moment(minDate)
        .add(r, 'days')
        .format('YYYY-MM-DD');
    });
  } else {
    ticks.forEach((r) => {
      marks[Math.floor(r)] = moment(minDate).add(r, 'days').format('YYYY');
    });
  }

  return marks;
});
