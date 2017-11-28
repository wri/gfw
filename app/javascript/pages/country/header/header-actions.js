import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { COUNTRY } from 'pages/country/router';

const setInitialState = createAction('setInitialState');
const setHeaderSelectValues = createAction('setHeaderSelectValues');
const setHeaderValues = createAction('setHeaderValues');
const setAdmin0 = createThunkAction(COUNTRY, admin0 => dispatch => {
  dispatch({ type: COUNTRY, payload: { admin0 } });
});
const setAdmin1 = createThunkAction(COUNTRY, (admin0, admin1) => dispatch => {
  dispatch({ type: COUNTRY, payload: { admin0, admin1 } });
});
const setAdmin2 = createThunkAction(
  COUNTRY,
  (admin0, admin1, admin2) => dispatch => {
    dispatch({ type: COUNTRY, payload: { admin0, admin1, admin2 } });
  }
);

export default {
  setInitialState,
  setHeaderSelectValues,
  setHeaderValues,
  setAdmin0,
  setAdmin1,
  setAdmin2
};
