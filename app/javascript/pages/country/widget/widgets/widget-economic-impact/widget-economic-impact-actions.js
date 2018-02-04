import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { getFAOEcoLive } from 'services/forest-data';

const setEconomicImpactLoading = createAction('setEconomicImpactLoading');
const setEconomicImpactData = createAction('setEconomicImpactData');
const setEconomicImpactSettings = createAction('setEconomicImpactSettings');

export const getEconomicImpact = createThunkAction(
  'getEconomicImpact',
  () => (dispatch, state) => {
    if (!state().widgetEconomicImpact.loading) {
      dispatch(setEconomicImpactLoading({ loading: true, error: false }));
      getFAOEcoLive()
        .then(response => {
          dispatch(
            setEconomicImpactData({
              fao: response.data.rows
            })
          );
        })
        .catch(error => {
          dispatch(setEconomicImpactLoading({ loading: false, error: true }));
          console.info(error);
        });
    }
  }
);

export default {
  setEconomicImpactLoading,
  setEconomicImpactData,
  getEconomicImpact,
  setEconomicImpactSettings
};
