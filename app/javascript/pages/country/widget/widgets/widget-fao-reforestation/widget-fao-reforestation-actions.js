import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getFAOExtent } from 'services/forest-data';

const setFAOReforestationIsLoading = createAction(
  'setFAOReforestationIsLoading'
);
const setFAOReforestationData = createAction('setFAOReforestationData');
const setFAOReforestationSettingsPeriod = createAction(
  'setFAOReforestationSettingsPeriod'
);
const getFAOReforestationData = createThunkAction(
  'getFAOReforestation',
  params => (dispatch, state) => {
    if (!state().widgetFAOReforestation.isLoading) {
      dispatch(setFAOReforestationIsLoading(true));
      getFAOExtent({ ...params })
        .then(response => {
          const data = response.data.rows;
          dispatch(
            setFAOReforestationData({
              name: (data.length && data[0].name) || '',
              rate: (data.length && data[0].rate) || 0
            })
          );
        })
        .catch(error => {
          console.info(error);
          dispatch(setFAOReforestationIsLoading(false));
        });
    }
  }
);

export default {
  setFAOReforestationIsLoading,
  setFAOReforestationData,
  setFAOReforestationSettingsPeriod,
  getFAOReforestationData
};
