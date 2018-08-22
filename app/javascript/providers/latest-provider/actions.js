import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import isEmpty from 'lodash/isEmpty';

import { fetchGLADLatest } from 'services/alerts';

export const setLatestLoading = createAction('setLatestLoading');
export const setLatest = createAction('setLatest');

export const getLatest = createThunkAction(
  'getLatest',
  () => (dispatch, getState) => {
    const state = getState();
    if (!isEmpty(state.latest.data)) {
      return;
    }

    dispatch(setLatestLoading({ loading: true, error: false }));
    // for now we are only fetching GLADs but soon we will be adding fires
    fetchGLADLatest()
      .then(latest => {
        const { date } = latest.data.data[0].attributes;
        dispatch(setLatest({ 'dd5df87f-39c2-4aeb-a462-3ef969b20b66': date }));
      })
      .catch(err => {
        dispatch(setLatestLoading({ loading: false, error: true }));
        console.warn(err);
      });
  }
);
