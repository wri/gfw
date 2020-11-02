import { differenceInDays } from 'date-fns';

export const getDayRange = (params) => {
  const { startDate, endDate, minDate, maxDate, weeks } = params || {};
  const minDateTime = new Date(minDate);
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
