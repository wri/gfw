import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getGainExtent } from 'services/forest-data';

const setTreeGainLoading = createAction('setTreeGainLoading');
const setTreeGainData = createAction('setTreeGainData');
const setTreeGainSettings = createAction('setTreeGainSettings');

const getTreeGain = createThunkAction(
  'getTreeGain',
  params => (dispatch, state) => {
    if (!state().widgetTreeGain.loading) {
      dispatch(setTreeGainLoading({ loading: true, error: false }));
      getGainExtent(params)
        .then(response => {
          const { data } = response.data;
          let mappedData = [];
          if (data && data.length) {
            mappedData = data.map(item => {
              const gain = item.gain ? item.gain : 0;
              return {
                id: item.region,
                gain,
                percentage: 100 * gain / item.extent
              };
            });
          }
          dispatch(setTreeGainData({ gain: mappedData }));
        })
        .catch(error => {
          console.info(error);
          dispatch(setTreeGainLoading({ loading: false, error: true }));
        });
    }
  }
);

export default {
  setTreeGainLoading,
  setTreeGainData,
  setTreeGainSettings,
  getTreeGain
};
