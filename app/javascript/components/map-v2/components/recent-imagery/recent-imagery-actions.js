import { createAction, createThunkAction } from 'redux-tools';
import axios from 'axios';
import { setComponentStateToUrl } from 'utils/stateToUrl';

import { getRecentTiles, getTiles, getThumbs } from 'services/recent-imagery';
import { initialState } from './recent-imagery-reducers';

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

export const getData = createThunkAction('getData', params => dispatch => {
  dispatch(setRecentImageryLoading(true));
  getRecentTiles({ ...params })
    .then(response => {
      const serializedResponse = serializeReponse(
        response.data && response.data.data && response.data.data.tiles
      );
      if (serializedResponse && !!serializedResponse.length) {
        const { clouds } = initialState.settings;
        const { source } = serializedResponse[0];
        const cloudScore = Math.round(serializedResponse[0].cloud_score);
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
            selected: source,
            clouds: cloudScore > clouds ? cloudScore : clouds
          })
        );
        dispatch(setRecentImageryLoading(false));
      }
    })
    .catch(error => {
      console.info(error);
    });
});

export const getMoreTiles = createThunkAction(
  'getMoreTiles',
  params => (dispatch, state) => {
    const { sources, dataStatus, bands, token } = params;
    axios
      .all([
        getTiles({ sources, token, bands }),
        getThumbs({ sources, token, bands })
      ])
      .then(
        axios.spread((tilesResponse, thumbsReponse) => {
          const tiles =
            tilesResponse.data &&
            tilesResponse.data.data &&
            tilesResponse.data.data.attributes;
          const thumbs =
            thumbsReponse.data &&
            thumbsReponse.data.data &&
            thumbsReponse.data.data.attributes;

          if (tiles && thumbs) {
            const data = state().recentImagery.data.slice();
            const requestedTiles = dataStatus.requestedTiles + tiles.length;
            const haveAllData = requestedTiles === data.length;
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
      });
  }
);
