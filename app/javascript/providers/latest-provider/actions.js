import axios from 'axios';
import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { fetchGLADLatest, fetchFormaLatest } from 'services/alerts';

export const setLatestLoading = createAction('setLatestLoading');
export const setLatest = createAction('setLatest');

export const getLatest = createThunkAction('getLatest', () => dispatch => {
  dispatch(setLatestLoading({ loading: true, error: false }));
  axios
    .all([fetchGLADLatest(), fetchFormaLatest()])
    .then(
      axios.spread((glads, forma) => {
        const gladsLatest = glads.data.data[0].attributes.date;
        const formaLatest = forma.data.date;
        dispatch(
          setLatest({
            'dd5df87f-39c2-4aeb-a462-3ef969b20b66': gladsLatest,
            '66203fea-2e58-4a55-b222-1dae075cf95d': formaLatest
          })
        );
      })
    )
    .catch(err => {
      dispatch(setLatestLoading({ loading: false, error: true }));
      console.warn(err);
    });
});
