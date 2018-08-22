import axios from 'axios';
import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import moment from 'moment';
import maxBy from 'lodash/maxBy';

import {
  fetchGLADLatest,
  fetchFormaLatest,
  fetchTerraLatest
} from 'services/alerts';

export const setLatestLoading = createAction('setLatestLoading');
export const setLatest = createAction('setLatest');

export const getLatest = createThunkAction('getLatest', () => dispatch => {
  dispatch(setLatestLoading({ loading: true, error: false }));
  axios
    .all([fetchGLADLatest(), fetchFormaLatest(), fetchTerraLatest()])
    .then(
      axios.spread((glads, forma, terra) => {
        const gladsLatest = glads.data.data[0].attributes.date;
        const formaLatest = forma.data.date;
        const terraData = terra.data.data;

        const terraMaxYear = maxBy(terraData, 'year');
        const terraMaxYears = terraData.filter(d => d.year === terraMaxYear);
        const tarraMaxDay = maxBy(terraMaxYears, 'day');

        dispatch(
          setLatest({
            'dd5df87f-39c2-4aeb-a462-3ef969b20b66': gladsLatest,
            '66203fea-2e58-4a55-b222-1dae075cf95d': formaLatest,
            '790b46ce-715a-4173-8f2c-53980073acb6': moment(terraMaxYear)
              .add(tarraMaxDay, 'days')
              .format('YYYY-MM-DD')
          })
        );
      })
    )
    .catch(err => {
      dispatch(setLatestLoading({ loading: false, error: true }));
      console.warn(err);
    });
});
