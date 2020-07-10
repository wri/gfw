import { createThunkAction } from 'utils/redux';

export const setMainMapView = createThunkAction(
  'setMainMapView',
  datasets => (dispatch, getState) => {
    const { query, payload } = getState().location;
    const { map, mainMap } = query || {};

    dispatch({
      type: 'map',
      payload: {
        ...payload,
        type: payload.type === 'global' ? undefined : payload.type
      },
      query: {
        ...query,
        map: {
          ...map,
          datasets,
          canBound: true
        },
        mainMap: {
          ...mainMap,
          showAnalysis: true
        }
      }
    });
  }
);
