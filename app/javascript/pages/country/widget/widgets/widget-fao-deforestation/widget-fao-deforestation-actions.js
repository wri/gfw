import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import { getFAODeforest, getFAODeforestRank } from 'services/forest-data';

const setFAODeforestationLoading = createAction('setFAODeforestationLoading');
const setFAODeforestationData = createAction('setFAODeforestationData');
const setFAODeforestationSettings = createAction('setFAODeforestationSettings');

const getFAODeforestationData = createThunkAction(
  'getFAODeforestation',
  params => (dispatch, state) => {
    if (!state().widgetFAODeforestation.loading) {
      dispatch(setFAODeforestationLoading({ loading: true, error: false }));
      axios
        .all([getFAODeforest({ ...params }), getFAODeforestRank({ ...params })])
        .then(
          axios.spread((getFAODeforestResponse, getFAODeforestRankResponse) => {
            const fao = getFAODeforestResponse.data.rows;
            const rank = getFAODeforestRankResponse.data.rows;
            dispatch(
              setFAODeforestationData({
                fao,
                rank
              })
            );
          })
        )
        .catch(error => {
          dispatch(setFAODeforestationLoading({ loading: false, error: true }));
          console.info(error);
        });
    }
  }
);

export default {
  setFAODeforestationLoading,
  setFAODeforestationData,
  setFAODeforestationSettings,
  getFAODeforestationData
};
