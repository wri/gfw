import { createThunkAction, createAction } from 'redux-tools';

import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setMapLoading = createAction('setMapLoading');

export const setMapSettings = createThunkAction(
  'setMapSettings',
  change => (dispatch, state) =>
    dispatch(
      setComponentStateToUrl({
        key: 'map',
        change,
        state
      })
    )
);
