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
  params => (dispatch, state) => {
    if (!state().widgetEconomicImpact.loading) {
      dispatch(setEconomicImpactLoading({ loading: true, error: false }));
      getFAOEcoLive()
        .then(response => {
          const { country, year } = params;
          const years = sortBy(
            uniq(
              response.data.rows
                .filter(
                  d =>
                    d.country === country &&
                    d.year !== 9999 &&
                    d.usdrev !== null &&
                    d.usdexp !== null &&
                    d.usdexp !== ''
                )
                .map(d => d.year)
            )
          );
          dispatch(
            setEconomicImpactData({
              data: { fao: response.data.rows },
              years,
              year: years.includes(year) ? year : years[0]
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
