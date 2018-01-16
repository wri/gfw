import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import { getGain, getExtent, getGainRanking } from 'services/forest-data';

const setTreeGainLoading = createAction('setTreeGainLoading');
const setTreeGainData = createAction('setTreeGainData');
const setTreeGainSettings = createAction('setTreeGainSettings');

const getTreeGain = createThunkAction(
  'getTreeGain',
  params => (dispatch, state) => {
    if (!state().widgetTreeGain.loading) {
      dispatch(setTreeGainLoading({ loading: true, error: false }));
      axios
        .all([
          getGain({ ...params }),
          getExtent({ ...params }),
          getGainRanking({ ...params })
        ])
        .then(
          axios.spread((gainResponse, extentResponse, gainRankingResponse) => {
            const gain = gainResponse.data.data;
            const extent = extentResponse.data.data;
            const ranking = getProcessedRankingData(
              gainRankingResponse.data.data,
              { ...params }
            );
            dispatch(
              setTreeGainData({
                gain: (gain && gain.length > 0 && gain[0].value) || 0,
                extent: (gain && extent.length > 0 && extent[0].value) || 0,
                ranking
              })
            );
          })
        )
        .catch(error => {
          console.info(error);
          dispatch(setTreeGainLoading({ loading: false, error: true }));
        });
    }
  }
);

const getProcessedRankingData = (rawData, params) => {
  const output = rawData
    .map(item => {
      const gain = item.gain ? item.gain : 0;
      return {
        id: item.region,
        gain,
        relative: 100 * gain / item.extent
      };
    })
    .filter(item => {
      if (params.subRegion) {
        return item.id !== params.subRegion;
      } else if (params.region) {
        return item.id !== params.region;
      }
      return item.id !== params.country;
    });

  return output.slice(0, 5);
};

export default {
  setTreeGainLoading,
  setTreeGainData,
  setTreeGainSettings,
  getTreeGain
};
