import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import { getFAO } from 'services/forest-data';
import { getRanking } from 'services/country';

const setFAOForestIsLoading = createAction('setFAOIsLoading');
const setFAOForestData = createAction('setFAOData');
const getFAOForest = createThunkAction(
  'getFAOForest',
  params => (dispatch, state) => {
    if (!state().widgetFAOForest.isLoading) {
      dispatch(setFAOForestIsLoading(true));
      axios
        .all([getFAO({ ...params }), getRanking({ ...params })])
        .then(
          axios.spread((getFAOResponse, getRankingResponse) => {
            const data =
              getFAOResponse.data.rows.length && getFAOResponse.data.rows[0];
            const ranking = getRankingResponse.data.rows;
            const values = {
              fao: {
                ...data
              },
              rank: ranking[0].rank || 0
            };

            dispatch(setFAOForestData(values));
          })
        )
        .catch(error => {
          console.info(error);
          dispatch(setFAOForestIsLoading(false));
        });
    }
  }
);

export default {
  setFAOForestIsLoading,
  setFAOForestData,
  getFAOForest
};
