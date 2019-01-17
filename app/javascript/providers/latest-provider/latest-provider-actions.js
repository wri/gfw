import { createAction, createThunkAction } from 'redux-tools';
import moment from 'moment';
import axios from 'axios';

import { fetchLatestDate } from 'services/alerts';

export const setLatestLoading = createAction('setLatestLoading');
export const setLatestDates = createAction('setLatestDates');

export const getLatest = createThunkAction(
  'getLatest',
  latestEndpoints => (dispatch, getState) => {
    const { latest } = getState();
    const currentLatestDates = latest && Object.keys(latest.data);
    const newEndpoints = latestEndpoints.filter(
      l => !currentLatestDates.includes(l.id)
    );
    if (newEndpoints && newEndpoints.length) {
      dispatch(setLatestLoading({ loading: true, error: false }));
      axios
        .all(newEndpoints.map(n => fetchLatestDate(n.latestUrl)))
        .then(
          axios.spread((...responses) => {
            const latestDates =
              responses &&
              responses.reduce((obj, response, index) => {
                const latestResponse = response.data.data || response.data;
                let date = latestResponse.date;
                if (!date) {
                  const data = Array.isArray(latestResponse)
                    ? latestResponse[0].attributes
                    : latestResponse.attributes;
                  date = data.date || data.latestResponse;
                }
                return {
                  ...obj,
                  [newEndpoints[index].id]: moment(date).format('YYYY-MM-DD')
                };
              }, {});
            dispatch(setLatestDates(latestDates));
          })
        )
        .catch(error => {
          console.error('Error in latest request:', error);
        });
    }
  }
);
