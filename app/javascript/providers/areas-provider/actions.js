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
            canBound: true,
            datasets: [
              // admin boundaries
              {
                dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
                layers: [
                  '6f6798e6-39ec-4163-979e-182a74ca65ee',
                  'c5d1e010-383a-4713-9aaa-44f728c0571c'
                ],
                opacity: 1,
                visibility: true
              },
              // gain
              {
                dataset: '70e2549c-d722-44a6-a8d7-4a385d78565e',
                layers: ['3b22a574-2507-4b4a-a247-80057c1a1ad4'],
                opacity: 1,
                visibility: true
              },
              // loss
              {
                dataset: '897ecc76-2308-4c51-aeb3-495de0bdca79',
                layers: ['c3075c5a-5567-4b09-bc0d-96ed1673f8b6'],
                opacity: 1,
                visibility: true
              },
              // extent
              {
                dataset: '044f4af8-be72-4999-b7dd-13434fc4a394',
                layers: ['78747ea1-34a9-4aa7-b099-bdb8948200f4'],
                opacity: 1,
                visibility: true
              }
            ]
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
