import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getMeta, getGas } from 'services/emissions';

const setEmissionsData = createAction('setEmissionsData');
const setEmissionsSettings = createAction('setEmissionsSettings');
const setEmissionsLoading = createAction('setEmissionsLoading');

const getEmissions = createThunkAction(
  'getEmissions',
  params => (dispatch, state) => {
    if (!state().widgetEmissions.loading) {
      dispatch(setEmissionsLoading({ loading: true, error: false }));
      getMeta()
        .then(getMetaResponse => {
          const dataSource = getMetaResponse.data.data_source.filter(
            item => item.source === 'historical_emissions_CAIT'
          );
          const gas = getMetaResponse.data.gas.filter(
            item => item.name === 'All GHG'
          );

          if (dataSource.length && gas.length) {
            getGas({ ...params, source: dataSource[0].id, gas: gas[0].id })
              .then(getGasResponse => {
                dispatch(setEmissionsData(getGasResponse.data));
              })
              .catch(error => {
                dispatch(setEmissionsLoading({ loading: false, error: true }));
                console.error(error);
              });
          } else {
            dispatch(setEmissionsData({}));
          }
        })
        .catch(error => {
          dispatch(setEmissionsLoading({ loading: false, error: true }));
          console.error(error);
        });
    }
  }
);

export default {
  setEmissionsData,
  setEmissionsSettings,
  setEmissionsLoading,
  getEmissions
};
