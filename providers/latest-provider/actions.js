import { createAction, createThunkAction } from 'redux/actions';
import moment from 'moment';
import { all, spread } from 'axios';

import { fetchLatestDate } from 'services/latest';
import { statsLatestDecoder } from 'services/stats-latest-decoder';

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
                  const days = statsLatestDecoder(bands);
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
