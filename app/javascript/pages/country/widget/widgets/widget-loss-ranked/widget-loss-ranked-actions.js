import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import { fetchLossRanked, fetchExtentRanked } from 'services/forest-data';

const setLossRankedLoading = createAction('setLossRankedLoading');
const setLossRankedData = createAction('setLossRankedData');
const setLossRankedSettings = createAction('setLossRankedSettings');

const getLossRanked = createThunkAction(
  'getLossRanked',
  params => (dispatch, state) => {
    if (!state().widgetLossRanked.loading) {
      dispatch(setLossRankedLoading({ loading: true, error: false }));
      axios
        .all([fetchLossRanked({ ...params }), fetchExtentRanked({ ...params })])
        .then(
          axios.spread((lossResponse, extentResponse) => {
            const { data } = lossResponse.data;
            let mappedData = [];
            if (data && data.length) {
              mappedData = data.map(item => {
                const loss = item.loss || 0;
                return {
                  ...item,
                  loss
                };
              });
            }
            dispatch(
              setLossRankedData({
                loss: mappedData,
                extent: extentResponse.data.data
              })
            );
          })
        )
        .catch(error => {
          console.info(error);
          dispatch(setLossRankedLoading({ loading: false, error: true }));
        });
    }
  }
);

export default {
  setLossRankedLoading,
  setLossRankedData,
  setLossRankedSettings,
  getLossRanked
};
