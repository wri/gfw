import { createSelector } from 'reselect';
import moment from 'moment';
import range from 'lodash/range';

const getDates = (state) => state.dates;
const getSliderStep = (state) => state.step;
const getMatchLegend = (state) => state.matchLegend;

const getTicksStep = (numOfYears, sliderStep, matchLegend) => {
  if (matchLegend && numOfYears && sliderStep) return numOfYears / sliderStep;
  return (numOfYears > 6 ? 6 : numOfYears);
}

export const getMarks = createSelector(getDates, getSliderStep, getMatchLegend, (dates, sliderStep, matchLegend) => {
  if (!dates) return null;
  const { minDate, maxDate, dynamicTimeline = false } = dates;
  const numOfYears = moment(maxDate).diff(minDate, 'years');
  const maxDays = moment(maxDate).diff(minDate, 'days');

  if (!numOfYears || maxDays <= 365) return null;

  const marks = {};
  const ticksStep = getTicksStep(numOfYears, sliderStep, matchLegend);

  let ticks = range(
    0,
    maxDays + 1,
    maxDays / ticksStep
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
