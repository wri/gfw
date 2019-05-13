import { createThunkAction, createAction } from 'redux-tools';
import { track } from 'app/analytics';
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

export const setDrawnGeostore = createThunkAction(
  'setDrawnGeostore',
  geostoreId => (dispatch, getState) => {
    track('analysisDrawComplete');
    const { query, type } = getState().location || {};
    const { map } = query || {};
    dispatch({
      type,
      payload: {
        type: 'geostore',
        adm0: geostoreId
      },
      query: {
        ...query,
        map: {
          ...map,
          canBound: true,
          drawing: false
        }
      }
    });
  }
);
