import { createAction } from 'redux-actions';
import isEmpty from 'lodash/isEmpty';
import { createThunkAction } from 'utils/redux';
import { sortByKey } from 'utils/data';

import { getFAODeforest, getFAODeforestRank } from 'services/forest-data';

const setFAODeforestationLoading = createAction('setFAODeforestationLoading');
const setFAODeforestationData = createAction('setFAODeforestationData');
const setFAODeforestationSettings = createAction('setFAODeforestationSettings');

const getFAODeforestationData = createThunkAction(
  'getFAODeforestation',
  params => (dispatch, state) => {
    if (!state().widgetFAODeforestation.loading) {
      dispatch(setFAODeforestationLoading({ loading: true, error: false }));
      getFAODeforest({ ...params })
        .then(getFAODeforestResponse => {
          let fao = getFAODeforestResponse.data.rows.filter(
            item => item.deforest
          );
          fao = sortByKey(fao, 'year', false);

          if (!isEmpty(fao)) {
            getFAODeforestRank(fao[0].year)
              .then(getFAODeforestRankResponse => {
                const rank = getFAODeforestRankResponse.data.rows;
                dispatch(
                  setFAODeforestationData({
                    fao,
                    rank
                  })
                );
              })
              .catch(error => {
                console.info(error);
                dispatch(
                  setFAODeforestationLoading({ loading: false, error: true })
                );
              });
          } else {
            dispatch(setFAODeforestationData({}));
          }
        })
        .catch(error => {
          console.info(error);
          dispatch(setFAODeforestationLoading({ loading: false, error: true }));
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
