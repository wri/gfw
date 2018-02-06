import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { getFAOEcoLive } from 'services/forest-data';

const setForestryEmploymentLoading = createAction(
  'setForestryEmploymentLoading'
);
const setForestryEmploymentData = createAction('setForestryEmploymentData');
const setForestryEmploymentSettings = createAction(
  'setForestryEmploymentSettings'
);

export const getForestryEmployment = createThunkAction(
  'getForestryEmployment',
  () => (dispatch, state) => {
    if (!state().widgetForestryEmployment.loading) {
      dispatch(setForestryEmploymentLoading({ loading: true, error: false }));
      getFAOEcoLive()
        .then(response => {
          dispatch(
            setForestryEmploymentData({
              fao: response.data.rows
            })
          );
        })
        .catch(error => {
          dispatch(
            setForestryEmploymentLoading({ loading: false, error: true })
          );
          console.info(error);
        });
    }
  }
);

export default {
  setForestryEmploymentLoading,
  setForestryEmploymentData,
  getForestryEmployment,
  setForestryEmploymentSettings
};
