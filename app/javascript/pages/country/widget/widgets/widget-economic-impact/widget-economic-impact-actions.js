import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { getFAOEcoLive } from 'services/forest-data';

import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';

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
              fao: response.data.rows,
              years: sortBy(
                uniq(
                  response.data.rows
                    .filter(d => d.year !== 9999)
                    .map(d => d.year)
                )
              )
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
