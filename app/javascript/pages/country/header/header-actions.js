import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { COUNTRY } from 'pages/country/router';

const setInitialState = createAction('setInitialState');
const setHeaderValues = createAction('setHeaderValues');
const selectCountry = createThunkAction(COUNTRY, iso => dispatch => {
  dispatch({ type: COUNTRY, payload: { iso } });
});
const setAdmin1 = createThunkAction(COUNTRY, (iso, admin1) => dispatch => {
  dispatch({ type: COUNTRY, payload: { iso, admin1 } });
});

export default {
  setInitialState,
  setHeaderValues,
  selectCountry,
  setAdmin1
};
