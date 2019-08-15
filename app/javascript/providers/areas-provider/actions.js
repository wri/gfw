import { createAction, createThunkAction } from 'redux-tools';

import { getAreaProvider, getAreasProvider } from 'services/areas';
import { MAP } from 'router';

export const setAreasLoading = createAction('setAreasLoading');
export const setAreas = createAction('setAreas');
export const setArea = createAction('setArea');

export const getAreas = createThunkAction(
  'getAreas',
  () => (dispatch, getState) => {
    const { areas, location } = getState();
    if (areas && !areas.loading) {
      dispatch(setAreasLoading(true));
      getAreasProvider()
        .then(response => {
          const { type, adm0 } = location.payload || {};
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
            if (type === 'aoi' && adm0 && !data.find(d => d.id === adm0)) {
              getAreaProvider(adm0).then(area => {
                const { data: areaData } = area.data;
                dispatch(
                  setArea({
                    id: areaData.id,
                    ...areaData.attributes,
                    notUserArea: true
                  })
                );
                dispatch(setAreasLoading(false));
              });
            } else {
              dispatch(setAreasLoading(false));
            }
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

export const getArea = createThunkAction(
  'getArea',
  id => (dispatch, getState) => {
    const { areas } = getState();
    if (areas && !areas.loading) {
      dispatch(setAreasLoading(true));
      getAreaProvider(id)
        .then(response => {
          const { data } = response.data;
          if (data) {
            dispatch(
              setArea({
                id: data.id,
                ...data.attributes,
                notUserArea: true
              })
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

export const clearArea = createThunkAction(
  'clearArea',
  () => (dispatch, getState) => {
    const { location } = getState();
    const { query, type } = location;
    dispatch({
      type,
      payload: {},
      query
    });
  }
);
