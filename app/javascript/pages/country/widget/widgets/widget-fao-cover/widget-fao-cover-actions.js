import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import { getFAO } from 'services/forest-data';
import { getRanking } from 'services/country';

const setFAOCoverLoading = createAction('setFAOCoverLoading');
const setFAOCoverData = createAction('setFAOCoverData');

const getFAOCover = createThunkAction(
  'getFAOCover',
  params => (dispatch, state) => {
    if (!state().widgetFAOCover.loading) {
      dispatch(setFAOCoverLoading(true));
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

            dispatch(setFAOCoverData(values));
          })
        )
        .catch(error => {
          console.info(error);
          dispatch(setFAOCoverLoading(false));
        });
    }
  }
);

export default {
  setFAOCoverLoading,
  setFAOCoverData,
  getFAOCover
};
