import moment from 'moment';
import { differenceInDays } from 'date-fns';
import has from 'lodash/has';
import find from 'lodash/find';

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
  latestMetadata,
  callback
) => {
  const latestDecode = find(
    l?.layerConfig?.decode_config,
    (d) => d?.key === 'endDate' && d?.url
  );
  const hasLatest = !!latestDecode && has(latestMetadata, l.id);

  if (hasLatest) {
    const range = {
      default: latestDecode?.default || 549, // where should timeline default to?,
      interval: latestDecode?.interval || 'days',
      max: latestDecode?.max || 730, // 2 years default
      min: 1,
    };
    const latestDate = latestMetadata[l.id];
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
