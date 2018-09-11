import { createAction, createThunkAction } from 'redux-tools';
import axios from 'axios';
import findIndex from 'lodash/findIndex';

import { getRecentTiles, getTiles, getThumbs } from 'services/recent-imagery';
import { initialState } from './recent-imagery-reducers';

export const toggleRecentImagery = createAction('toggleRecentImagery');
export const setVisible = createAction('setVisible');
export const setTimelineFlag = createAction('setTimelineFlag');
export const setRecentImageryData = createAction('setRecentImageryData');
export const setRecentImageryDataStatus = createAction(
  'setRecentImageryDataStatus'
);
export const setRecentImagerySettings = createAction(
  'setRecentImagerySettings'
);
export const setRecentImageryShowSettings = createAction(
  'setRecentImageryShowSettings'
);

export const getData = createThunkAction('getData', params => dispatch => {
  getRecentTiles({ ...params })
    .then(response => {
      if (response.data.data.tiles) {
        const { clouds } = initialState.settings;
        const { source } = response.data.data.tiles[0].attributes;
        const cloud_score = Math.round(
          response.data.data.tiles[0].attributes.cloud_score
        );

        dispatch(
          setRecentImageryData({
            data: response.data.data,
            dataStatus: {
              haveAllData: false,
              requestedTiles: 0
            },
            settings: {
              selectedTileSource: source,
              clouds: cloud_score > clouds ? cloud_score : clouds
            }
          })
        );
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
        axios.spread((getTilesResponse, getThumbsResponse) => {
          if (
            getTilesResponse.data.data &&
            getTilesResponse.data.data.attributes.length &&
            getThumbsResponse.data.data &&
            getThumbsResponse.data.data.attributes.length
          ) {
            const stateData = state().recentImagery.data;
            const data = { ...stateData, tiles: stateData.tiles.slice() };
            const tiles = getTilesResponse.data.data.attributes;
            const thumbs = getThumbsResponse.data.data.attributes;
            const requestedTiles = dataStatus.requestedTiles + tiles.length;
            const haveAllData = requestedTiles === data.tiles.length;

            tiles.forEach((item, i) => {
              if (i > 0) {
                const index = findIndex(
                  data.tiles,
                  d => d.attributes.source === item.source_id
                );
                if (index !== -1) {
                  data.tiles[index].attributes.tile_url = item.tile_url;
                }
              }
            });
            thumbs.forEach(item => {
              const index = findIndex(
                data.tiles,
                d => d.attributes.source === item.source
              );
              if (index !== -1) {
                data.tiles[index].attributes.thumbnail_url = item.thumbnail_url;
              }
            });

            dispatch(
              setRecentImageryData({
                data,
                dataStatus: {
                  haveAllData,
                  requestedTiles
                }
              })
            );
          }
        })
      )
      .catch(error => {
        dispatch(
          setRecentImageryData({
            dataStatus: {
              requestFails: params.dataStatus.requestFails + 1
            }
          })
        );
        console.info(error);
      });
  }
);

export const resetData = createThunkAction('resetData', () => dispatch => {
  dispatch(setRecentImageryShowSettings(false));
  dispatch(
    setRecentImageryData({
      data: {},
      dataStatus: {
        haveAllData: false,
        requestedTiles: 0
      }
    })
  );
});
