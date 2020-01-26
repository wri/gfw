import { createThunkAction } from 'utils/redux';
import { MAP } from 'app/router';

export const setMainMapView = createThunkAction(
  'setMainMapView',
  datasets => (dispatch, getState) => {
    const { query, payload } = getState().location;
    const { map, mainMap } = query || {};

    dispatch({
      type: MAP,
      payload: {
        ...payload,
        type: payload.type === 'global' ? undefined : payload.type
      },
      query: {
        ...query,
        map: {
          ...map,
          datasets
        },
        mainMap: {
          ...mainMap,
          showAnalysis: true
        }
      }
    });
  }
);
