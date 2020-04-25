import { createAction, createThunkAction } from 'utils/redux';
import { all, spread } from 'axios';
import minBy from 'lodash/minBy';
import { setComponentStateToUrl } from 'app/stateToUrl';

import { getRecentTiles, getTiles, getThumbs } from 'services/recent-imagery';

const serializeReponse = response =>
  response &&
  !!response.length &&
  response.map(r => ({
    ...r.attributes
  }));

export const setRecentImageryData = createAction('setRecentImageryData');
export const setRecentImageryDataStatus = createAction(
  'setRecentImageryDataStatus'
);
export const resetRecentImageryData = createAction('resetRecentImageryData');
export const setRecentImageryLoading = createAction('setRecentImageryLoading');
export const setRecentImageryLoadingMoreTiles = createAction(
  'setRecentImageryLoadingMoreTiles'
);

export const setRecentImagerySettings = createThunkAction(
  'setRecentImagerySettings',
  change => (dispatch, state) =>
    dispatch(
      setComponentStateToUrl({
        key: 'recentImagery',
        change,
        state
      })
    )
);

export const getRecentImageryData = createThunkAction(
  'getRecentImageryData',
  params => (dispatch, getState) => {
    const { recentImagery } = getState();
    if (recentImagery && !recentImagery.loading) {
      dispatch(setRecentImageryLoading({ loading: true, error: false }));
      getRecentTiles({ ...params })
        .then(response => {
          const serializedResponse = serializeReponse(
            response.data && response.data.data && response.data.data.tiles
          );
          if (serializedResponse && !!serializedResponse.length) {
            const clouds = 25;
            const minCloudScore = Math.ceil(
              minBy(serializedResponse, 'cloud_score')
            );
            dispatch(
              setRecentImageryData({
                data: serializedResponse,
                dataStatus: {
                  haveAllData: false,
                  requestedTiles: 0
                }
              })
            );
            dispatch(
              setRecentImagerySettings({
                clouds: minCloudScore > clouds ? minCloudScore : clouds,
                selected: null,
                selectedIndex: 0
              })
            );
            dispatch(setRecentImageryLoading({ loading: false, error: false }));
          }
        })
        .catch(() => {
          dispatch(setRecentImageryLoading({ loading: false, error: true }));
        });
    }
  }
);

export const getMoreTiles = createThunkAction(
  'getMoreTiles',
  params => (dispatch, getState) => {
    const { recentImagery } = getState();
    if (
      recentImagery &&
      !recentImagery.loadingMoreTiles &&
      !recentImagery.loading
    ) {
      dispatch(
        setRecentImageryLoadingMoreTiles({
          loadingMoreTiles: true
        })
      );
      const { sources, dataStatus, bands } = params;
      all([getTiles({ sources, bands }), getThumbs({ sources, bands })])
        .then(
          spread((tilesResponse, thumbsReponse) => {
            const tiles =
              tilesResponse.data &&
              tilesResponse.data.data &&
              tilesResponse.data.data.attributes;
            const thumbs =
              thumbsReponse.data &&
              thumbsReponse.data.data &&
              thumbsReponse.data.data.attributes;

            if (tiles && thumbs) {
              const data = recentImagery && recentImagery.data.slice();
              const requestedTiles = dataStatus.requestedTiles + tiles.length;
              const haveAllData = requestedTiles >= data.length;
              const newData = data.map((d, i) => {
                const tile = tiles.find(t => t.source_id === d.source);
                const thumb = thumbs.find(t => t.source === d.source);
                return {
                  ...d,
                  ...(tile &&
                    i > 0 && {
                      tile_url: tile.tile_url
                    }),
                  ...(thumb && {
                    thumbnail_url: thumb.thumbnail_url
                  })
                };
              });

              dispatch(
                setRecentImageryData({
                  data: newData,
                  dataStatus: {
                    haveAllData,
                    requestedTiles
                  }
                })
              );
              dispatch(
                setRecentImageryLoadingMoreTiles({
                  loadingMoreTiles: false
                })
              );
            }
          })
        )
        .catch(() => {
          dispatch(
            setRecentImageryData({
              dataStatus: {
                requestFails: params.dataStatus.requestFails + 1
              }
            })
          );
          dispatch(
            setRecentImageryLoadingMoreTiles({
              loadingMoreTiles: false
            })
          );
        });
    }
  }
);
