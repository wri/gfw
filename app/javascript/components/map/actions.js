import { createThunkAction, createAction } from 'utils/redux';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setMapLoading = createAction('setMapLoading');
export const setMapInteractions = createAction('setMapInteractions');
export const setMapInteractionSelected = createAction(
  'setMapInteractionSelected'
);
export const clearMapInteractions = createAction('clearMapInteractions');

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
