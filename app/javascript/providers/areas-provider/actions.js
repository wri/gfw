import { createAction, createThunkAction } from 'utils/redux';
import useRouter from 'app/router';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_GAIN_DATASET,
  FOREST_LOSS_DATASET,
  FOREST_EXTENT_DATASET,
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_GAIN,
  FOREST_LOSS,
  FOREST_EXTENT,
} from 'data/layers';

import { getAreas, getArea } from 'services/areas';

export const setAreasLoading = createAction('setAreasLoading');
export const setAreas = createAction('setAreas');
export const setArea = createAction('setArea');

export const getAreasProvider = createThunkAction(
  'getAreasProvider',
  () => (dispatch, getState) => {
    const { location } = getState();
    dispatch(setAreasLoading({ loading: true, error: false }));
    getAreas()
      .then((areas) => {
        const { type, adm0 } = location.payload || {};
        if (areas && !!areas.length) {
          dispatch(setAreas(areas));
          if (
            type === 'aoi' &&
            adm0 &&
            !areas.find((d) => d.id === adm0 || d.subscriptionId === adm0)
          ) {
            getArea(adm0)
              .then((area) => {
                dispatch(setArea(area));
                dispatch(setAreasLoading({ loading: false, error: false }));
              })
              .catch((error) => {
                dispatch(
                  setAreasLoading({
                    loading: false,
                    error: error.response.status,
                  })
                );
              });
          } else {
            dispatch(setAreasLoading({ loading: false, error: false }));
          }
        } else {
          dispatch(setAreasLoading({ loading: false, error: false }));
        }
      })
      .catch((error) => {
        dispatch(
          setAreasLoading({ loading: false, error: error.response.status })
        );
      });
  }
);

export const getAreaProvider = createThunkAction(
  'getAreaProvider',
  (id) => (dispatch, getState) => {
    const { myGfw } = getState();
    const { data: userData } = myGfw || {};
    dispatch(setAreasLoading({ loading: true, error: false }));
    getArea(id)
      .then((area) => {
        dispatch(
          setArea({
            ...area,
            userArea: userData && userData.id === area.userId,
          })
        );
        dispatch(setAreasLoading({ loading: false, error: false }));
      })
      .catch((error) => {
        dispatch(
          setAreasLoading({ loading: false, error: error.response.status })
        );
      });
  }
);

export const viewArea = createThunkAction(
  'viewArea',
  ({ areaId, route }) => () => {
    const { query, pushDynamic, pathname } = useRouter();
    const { mainMap, map } = query || {};

    if (areaId) {
      pushDynamic({
        pathname: route || pathname,
        query: {
          ...query,
          location: `aoi/${areaId}`,
          ...(pathname.includes('map') && {
            mainMap: {
              ...mainMap,
              showAnalysis: true,
            },
          }),
          map: {
            ...map,
            canBound: true,
            ...(map &&
              !map.datasets && {
                datasets: [
                  // admin boundaries
                  {
                    dataset: POLITICAL_BOUNDARIES_DATASET,
                    layers: [
                      DISPUTED_POLITICAL_BOUNDARIES,
                      POLITICAL_BOUNDARIES,
                    ],
                    opacity: 1,
                    visibility: true,
                  },
                  // gain
                  {
                    dataset: FOREST_GAIN_DATASET,
                    layers: [FOREST_GAIN],
                    opacity: 1,
                    visibility: true,
                  },
                  // loss
                  {
                    dataset: FOREST_LOSS_DATASET,
                    layers: [FOREST_LOSS],
                    opacity: 1,
                    visibility: true,
                  },
                  // extent
                  {
                    dataset: FOREST_EXTENT_DATASET,
                    layers: [FOREST_EXTENT],
                    opacity: 1,
                    visibility: true,
                  },
                ],
              }),
          },
        },
      });
    }
  }
);

export const clearArea = createThunkAction('clearArea', () => () => {
  const { query, pathname, pushDynamic } = useRouter();

  pushDynamic({
    pathname,
    query: {
      ...query,
      location: ['global'],
    },
  });
});
