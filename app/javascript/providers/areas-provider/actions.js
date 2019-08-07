import { createAction, createThunkAction } from 'redux-tools';

import { getAreasProvider } from 'services/areas';
import { MAP } from 'router';

export const setAreasLoading = createAction('setAreasLoading');
export const setAreas = createAction('setAreas');
export const setArea = createAction('setArea');

export const getAreas = createThunkAction(
  'getAreas',
  () => (dispatch, getState) => {
    const { areas } = getState();
    if (areas && !areas.loading) {
      dispatch(setAreasLoading(true));
      getAreasProvider(process.env.DEMO_USER_TOKEN)
        .then(response => {
          const { data } = response.data;
          if (data && !!data.length) {
            dispatch(
              setAreas(
                data.map(d => ({
                  id: d.id,
                  ...d.attributes
                }))
              )
            );
          }
          dispatch(setAreasLoading(false));
        })
        .catch(error => {
          dispatch(setAreasLoading(false));
          console.info(error);
        });
    }
  }
);

export const viewArea = createThunkAction(
  'viewArea',
  areaId => (dispatch, getState) => {
    const { location } = getState();
    if (areaId && location) {
      const { query } = location;
      const { mainMap, map } = query || {};
      dispatch({
        type: MAP,
        payload: {
          type: 'aoi',
          adm0: areaId
        },
        query: {
          ...query,
          mainMap: {
            ...mainMap,
            showAnalysis: true
          },
          map: {
            ...map,
            canBound: true
          }
        }
      });
    }
  }
);
