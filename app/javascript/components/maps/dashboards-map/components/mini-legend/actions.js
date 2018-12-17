import { createThunkAction } from 'redux-tools';
import { MAP } from 'app/router';

export const setMainMapView = createThunkAction(
  'setMainMapView',
  datasets => (dispatch, getState) => {
    const { query, payload } = getState().location;
    const { map } = query || {};

    dispatch({
      type: MAP,
      payload,
      query: {
        ...query,
        map: {
          ...map,
          datasets
        }
      }
    });
  }
);
