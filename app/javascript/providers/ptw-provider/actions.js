import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import moment from 'moment';

import { getPTWProvider } from 'services/places-to-watch';

export const setPTWLoading = createAction('setPTWLoading');
export const setPTW = createAction('setPTW');

export const getPTW = createThunkAction('getPTW', date => (dispatch, state) => {
  if (!state().geostore.loading) {
    dispatch(setPTWLoading(true));
    getPTWProvider(moment(date).format('YYYY-MM-DD'))
      .then(response => {
        const { rows } = response.data;
        if (rows && rows.attributes) {
          dispatch(setPTW(rows));
        }
        dispatch(setPTWLoading(false));
      })
      .catch(error => {
        dispatch(setPTWLoading(false));
        console.info(error);
      });
  }
});
