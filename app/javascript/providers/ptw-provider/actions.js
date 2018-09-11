import { createAction, createThunkAction } from 'redux-tools';
import uniqBy from 'lodash/uniqBy';
import moment from 'moment';

import { getPTWProvider } from 'services/places-to-watch';

export const setPTWLoading = createAction('setPTWLoading');
export const setPTW = createAction('setPTW');

export const getPTW = createThunkAction('getPTW', date => (dispatch, state) => {
  if (!state().ptw.loading) {
    dispatch(setPTWLoading(true));
    getPTWProvider(moment(date).format('YYYY-MM-DD'))
      .then(response => {
        const { rows } = response.data;
        if (rows && !!rows.length) {
          dispatch(setPTW(uniqBy(rows, 'cartodb_id')));
        }
        dispatch(setPTWLoading(false));
      })
      .catch(error => {
        dispatch(setPTWLoading(false));
        console.info(error);
      });
  }
});
