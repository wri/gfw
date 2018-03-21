import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { fetchLossRanked } from 'services/forest-data';

const setLossRankedLoading = createAction('setLossRankedLoading');
const setLossRankedData = createAction('setLossRankedData');
const setLossRankedSettings = createAction('setLossRankedSettings');

const getLossRanked = createThunkAction(
  'getLossRanked',
  params => (dispatch, state) => {
    if (!state().widgetLossRanked.loading) {
      dispatch(setLossRankedLoading({ loading: true, error: false }));
      fetchLossRanked(params)
        .then(response => {
          const { data } = response.data;
          let mappedData = [];
          if (data && data.length) {
            mappedData = data.map(item => {
              const loss = item.loss || 0;
              return {
                ...item,
                label: item.iso,
                id: item.iso,
                loss,
                percentage: item.extent ? 100 * loss / item.extent : 0
              };
            });
          }
          dispatch(setLossRankedData({ loss: mappedData }));
        })
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
