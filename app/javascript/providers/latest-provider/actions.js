import axios from 'axios';
import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import moment from 'moment';

import {
  fetchGLADLatest,
  fetchFormaLatest,
  fetchTerraLatest,
  fetchSADLatest
} from 'services/alerts';

export const setLatestLoading = createAction('setLatestLoading');
export const setLatest = createAction('setLatest');

export const getLatest = createThunkAction('getLatest', () => dispatch => {
  dispatch(setLatestLoading({ loading: true, error: false }));
  axios
    .all([
      fetchGLADLatest(),
      fetchFormaLatest(),
      fetchTerraLatest(),
      fetchSADLatest()
    ])
    .then(
      axios.spread((glads, forma, terra, sad) => {
        const gladsLatest = glads.data.data[0].attributes.date;
        const formaLatest = forma.data.date;
        const terraData = moment(`${terra.data.data[0].year}-01-01`)
          .add(terra.data.data[0].day, 'days')
          .format('YYYY-MM-DD');
        const sadLatest = moment(sad.data.rows[0].date).format('YYYY-MM-DD');

        dispatch(
          setLatest({
            'dd5df87f-39c2-4aeb-a462-3ef969b20b66': gladsLatest,
            '66203fea-2e58-4a55-b222-1dae075cf95d': formaLatest,
            '790b46ce-715a-4173-8f2c-53980073acb6': terraData,
            '3ec29734-4627-45b1-b320-680e4b4b939e': sadLatest
          })
        );
      })
    )
    .catch(err => {
      dispatch(setLatestLoading({ loading: false, error: true }));
      console.warn(err);
    });
});
