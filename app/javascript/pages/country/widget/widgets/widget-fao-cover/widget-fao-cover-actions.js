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
      dispatch(setFAOCoverLoading({ loading: true, error: false }));
      axios
        .all([getFAO({ ...params }), getRanking({ ...params })])
        .then(
          axios.spread((getFAOResponse, getRankingResponse) => {
            let data = {};
            const fao = getFAOResponse.data.rows;
            const ranking = getRankingResponse.data.rows;
            if (fao.length && ranking.length) {
              data = {
                ...fao[0],
                rank: ranking[0].rank || 0
              };
            }
            dispatch(setFAOCoverData(data));
          })
        )
        .catch(error => {
          console.info(error);
          dispatch(setFAOCoverLoading({ loading: false, error: true }));
        });
    }
  }
);

export default {
  setFAOCoverLoading,
  setFAOCoverData,
  getFAOCover
};
