import compact from 'lodash/compact';
import moment from 'moment';

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

export const getDayRange = params => {
  const { startDate, endDate, minDate, maxDate, weeks } = params || {};

  const minDateTime = new Date(minDate);
  const maxDateTime = new Date(maxDate);
  const numberOfDays = dateDiffInDays(maxDateTime, minDateTime);

  // timeline or hover effect active range
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);
  const activeStartDay =
    numberOfDays - dateDiffInDays(maxDateTime, startDateTime);
  const activeEndDay = numberOfDays - dateDiffInDays(maxDateTime, endDateTime);
  // show specified weeks from end date
  const rangeStartDate = weeks && numberOfDays - 7 * weeks;
  // get start and end day
  const startDayIndex = activeStartDay || rangeStartDate || 0;
  const endDayIndex = activeEndDay || numberOfDays;

  return {
    startDayIndex,
    endDayIndex,
    numberOfDays
  };
};

export const buildDateArray = (startDate, stopDate, resolution, interval) => {
  const dateArray = [];
  let currentDate = moment(startDate);
  const endDate = moment(stopDate);
  while (currentDate <= endDate) {
    dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
    currentDate = moment(currentDate).add(interval || 1, resolution || 'days');
  }
  return dateArray;
};
