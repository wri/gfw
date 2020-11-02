import moment from 'moment';

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
