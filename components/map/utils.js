import moment from 'moment';
import { differenceInDays } from 'date-fns';
import has from 'lodash/has';

export const getDayRange = (params) => {
  const { startDate, endDate, minDate, maxDate, weeks, minDateAbsolut = null } =
    params || {};
  // If min date absolut, always take its value (dynamic timeline)
  const minDateTime = new Date(minDateAbsolut || minDate);
  const maxDateTime = new Date(maxDate);

  const numberOfDays = differenceInDays(maxDateTime, minDateTime);

  // timeline or hover effect active range
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);
  const activeStartDay =
    numberOfDays - differenceInDays(maxDateTime, startDateTime);
  const activeEndDay =
    numberOfDays - differenceInDays(maxDateTime, endDateTime);

  // show specified weeks from end date
  const rangeStartDate = weeks && numberOfDays - 7 * weeks;

  // get start and end day
  const startDayIndex = activeStartDay || rangeStartDate || 0;
  const endDayIndex = activeEndDay || numberOfDays;
  return {
    startDayIndex,
    endDayIndex,
    numberOfDays,
  };
};

export const handleDynamicTimeline = (
  l,
  dsMetadata,
  timelineParams,
  callback
) => {
  const hasLatest = l.dataset === 'integrated-deforestation-alerts-8bit';
  const range = {
    default: 549,
    interval: 'days',
    max: 730,
    min: 1,
  };

  if (
    hasLatest &&
    has(dsMetadata, 'https://api.resourcewatch.org/glad-alerts/latest')
  ) {
    const latestDate =
      dsMetadata['https://api.resourcewatch.org/glad-alerts/latest'];
    const maxDate = moment(latestDate).format('YYYY-MM-DD');
    const minDate = moment(maxDate)
      .subtract(range.max, range.interval)
      .format('YYYY-MM-DD');
    const startDate = moment(latestDate)
      .subtract(range.default, range.interval)
      .format('YYYY-MM-DD');

    return callback({
      minDate,
      maxDate,
      startDate: timelineParams?.startDate || startDate,
      startDateAbsolute: startDate,
      endDateAbsolute: maxDate,
    });
  }

  return callback(null);
};
