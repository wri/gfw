import { createAction, createThunkAction } from 'redux-tools';

import { getAreasProvider } from 'services/areas';

export const setAreasLoading = createAction('setAreasLoading');
export const setAreas = createAction('setAreas');
export const setArea = createAction('setArea');
export const setActiveArea = createAction('setActiveArea');
export const clearActiveArea = createAction('clearActiveArea');

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
