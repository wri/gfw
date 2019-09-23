import { createAction, createThunkAction } from 'redux-tools';

import { getAreaProvider, getAreasProvider } from 'services/areas';

export const setAreasLoading = createAction('setAreasLoading');
export const setAreas = createAction('setAreas');
export const setArea = createAction('setArea');

export const getAreas = createThunkAction(
  'getAreas',
  () => (dispatch, getState) => {
    const { location } = getState();
    dispatch(setAreasLoading({ loading: true, error: false }));
    getAreasProvider()
      .then(response => {
        const { type, adm0 } = location.payload || {};
        const { data } = response.data;
        if (data && !!data.length) {
          dispatch(
            setAreas(
              data.map(d => ({
                id: d.id,
                ...d.attributes,
                userArea: true
              }))
            )
          );
          if (type === 'aoi' && adm0 && !data.find(d => d.id === adm0)) {
            getAreaProvider(adm0)
              .then(area => {
                const { data: areaData } = area.data;
                dispatch(
                  setArea({
                    id: areaData.id,
                    ...areaData.attributes
                  })
                );
                dispatch(setAreasLoading({ loading: false, error: false }));
              })
              .catch(error => {
                dispatch(
                  setAreasLoading({
                    loading: false,
                    error: error.response.status
                  })
                );
                if (error.response.status !== 401) {
                  console.info(error);
                }
              });
          } else {
            dispatch(setAreasLoading({ loading: false, error: false }));
          }
        } else {
          dispatch(setAreasLoading({ loading: false, error: false }));
        }
      })
      .catch(error => {
        dispatch(
          setAreasLoading({ loading: false, error: error.response.status })
        );
        console.info(error);
      });
  }
);

export const getArea = createThunkAction(
  'getArea',
  id => (dispatch, getState) => {
    const { myGfw } = getState();
    const { data: userData } = myGfw || {};
    dispatch(setAreasLoading({ loading: true, error: false }));
    getAreaProvider(id)
      .then(response => {
        const { data } = response.data;
        if (data) {
          dispatch(
            setArea({
              id: data.id,
              ...data.attributes,
              userArea: userData && userData.id === data.attributes.userId
            })
          );
        }
        dispatch(setAreasLoading({ loading: false, error: false }));
      })
      .catch(error => {
        dispatch(
          setAreasLoading({ loading: false, error: error.response.status })
        );
        if (error.response.status !== 401) {
          console.info(error);
        }
      });
  }
);

export const viewArea = createThunkAction(
  'viewArea',
  ({ areaId, locationType }) => (dispatch, getState) => {
    const { location } = getState();

    if (areaId && location) {
      const { query, type } = location;
      const { mainMap, map } = query || {};

      dispatch({
        type: locationType || type,
        payload: {
          type: 'aoi',
          adm0: areaId
        },
        query: {
          ...query,
          ...((type === 'location/MAP' || locationType === 'location/MAP') && {
            mainMap: {
              ...mainMap,
              showAnalysis: true
            }
          }),
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
