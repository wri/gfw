import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { COUNTRY } from 'pages/country/router';

const setInitialState = createAction('setInitialState');
const setHeaderValues = createAction('setHeaderValues');
const selectCountry = createThunkAction(COUNTRY, iso => dispatch => {
  dispatch({ type: COUNTRY, payload: { iso } });
});
const selectRegion = createThunkAction(COUNTRY, (iso, region) => dispatch => {
  dispatch({ type: COUNTRY, payload: { iso, region } });
});

export default {
  setInitialState,
  setHeaderValues,
  selectCountry,
  selectRegion
};
