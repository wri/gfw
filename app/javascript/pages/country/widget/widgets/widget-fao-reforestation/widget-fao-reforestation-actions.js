import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getFAOExtent } from 'services/forest-data';

const setFAOReforestationLoading = createAction('setFAOReforestationLoading');
const setFAOReforestationData = createAction('setFAOReforestationData');
const setFAOReforestationSettings = createAction('setFAOReforestationSettings');

const getFAOReforestationData = createThunkAction(
  'getFAOReforestation',
  params => (dispatch, state) => {
    if (!state().widgetFAOReforestation.loading) {
      dispatch(setFAOReforestationLoading(true));
      getFAOExtent({ ...params })
        .then(response => {
          const data = response.data.rows;
          dispatch(
            setFAOReforestationData({
              name: (data && data.length > 0 && data[0].name) || '',
              rate: (data && data.length > 0 && data[0].rate) || 0
            })
          );
        })
        .catch(error => {
          console.info(error);
          dispatch(setFAOReforestationLoading(false));
        });
    }
  }
);

export default {
  setFAOReforestationLoading,
  setFAOReforestationData,
  setFAOReforestationSettings,
  getFAOReforestationData
};
