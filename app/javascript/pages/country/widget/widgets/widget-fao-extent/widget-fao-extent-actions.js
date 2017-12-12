import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getFAOExtent } from 'services/forest-data';

const setFAOExtentIsLoading = createAction('setFAOExtentIsLoading');
const setFAOExtentData = createAction('setFAOExtentData');
const setFAOExtentSettingsPeriod = createAction('setFAOExtentSettingsPeriod');
const getFAOExtentData = createThunkAction(
  'getFAOExtent',
  params => (dispatch, state) => {
    if (!state().widgetFAOExtent.isLoading) {
      dispatch(setFAOExtentIsLoading(true));
      getFAOExtent({ ...params })
        .then(response => {
          const { name, rate } = response.data.rows[0];
          dispatch(
            setFAOExtentData({
              name,
              rate
            })
          );
        })
        .catch(error => {
          console.info(error);
          dispatch(setFAOExtentIsLoading(false));
        });
    }
  }
);

export default {
  setFAOExtentIsLoading,
  setFAOExtentData,
  setFAOExtentSettingsPeriod,
  getFAOExtentData
};
