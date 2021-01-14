import { createAction, createThunkAction } from 'redux/actions';
import moment from 'moment';
import { all, spread } from 'axios';

import { fetchLatestDate } from 'services/latest';

export const setLatestLoading = createAction('setLatestLoading');
export const setLatestDates = createAction('setLatestDates');

export const getLatest = createThunkAction(
  'getLatest',
  (latestEndpoints) => (dispatch, getState) => {
    const { latest } = getState();
    const currentLatestDates = latest && Object.keys(latest.data);
    const newEndpoints = latestEndpoints.filter(
      (l) => !currentLatestDates.includes(l.id)
    );
    if (newEndpoints && newEndpoints.length) {
      dispatch(setLatestLoading({ loading: true, error: false }));
      all(newEndpoints.map((n) => fetchLatestDate(n.latestUrl)))
        .then(
          spread((...responses) => {
            const latestDates =
              responses &&
              responses.reduce((obj, response, index) => {
                const latestResponse = response.data.data || response.data;
                let date = latestResponse.date || latestResponse.max_date;
                const { bands } = latestResponse;
                // if the response is from the stats endpoint, get bands key
                if (bands && bands.length) {
                  const { max, histogram } = bands[0];

                  // high confidence alerts from top-level max
                  // max = abbbb where a = confidence value, bbbb = days since 2014-12-31
                  const encodedMax = max.toString(10);
                  const daysSinceString = encodedMax.substring(
                    1,
                    encodedMax.length
                  );
                  const daysSince = parseInt(daysSinceString, 10);

                  // low confidence alerts from histogram
                  // need to find the last non-zero bin where where index < 30,000 (high conf)
                  const binSize =
                    (histogram.max - histogram.min) / histogram.bin_count;
                  const maxBinIndex = Math.floor(
                    (30000 - histogram.min) / binSize
                  );
                  const valueBins = histogram.value_count
                    .slice(0, maxBinIndex)
                    .reverse();
                  const latestIndex = valueBins.findIndex((el) => el !== 0);

                  // Start of bin represents the encoded value
                  const binStart = parseInt(
                    histogram.min + (maxBinIndex - latestIndex) * binSize,
                    10
                  );
                  const encodedMaxLowConfidence = binStart.toString(10);
                  const daysSinceStringLowConfidence = encodedMaxLowConfidence.substring(
                    1,
                    encodedMaxLowConfidence.length
                  );
                  const daysSinceLowConfidence = parseInt(
                    daysSinceStringLowConfidence,
                    10
                  );

                  // whichever is latest (i.e. most days since 2014-12-31)
                  const days =
                    daysSinceLowConfidence > daysSince
                      ? daysSinceLowConfidence
                      : daysSince;

                  // convert to date
                  date = moment('2014-12-31')
                    .add(days, 'days')
                    .format('YYYY-MM-DD');
                }
                if (!date) {
                  const data = Array.isArray(latestResponse)
                    ? latestResponse[0].attributes
                    : latestResponse.attributes;
                  date =
                    data && (data.date || data.latestResponse || data.latest);
                }
                let latestDate = moment(date).utc();
                if (newEndpoints[index].resolution) {
                  latestDate = latestDate.endOf(newEndpoints[index].resolution);
                }

                return {
                  ...obj,
                  [newEndpoints[index].id]: latestDate.format('YYYY-MM-DD'),
                };
              }, {});
            dispatch(setLatestDates(latestDates));
          })
        )
        .catch(() => {
          dispatch(setLatestLoading({ loading: false, error: true }));
        });
    }
  }
);
