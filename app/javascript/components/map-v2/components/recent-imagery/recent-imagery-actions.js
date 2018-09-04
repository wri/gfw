import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios, { CancelToken } from 'axios';
import findIndex from 'lodash/findIndex';
import { setComponentStateToUrl } from 'utils/stateToUrl';

import { getRecentTiles, getTiles, getThumbs } from 'services/recent-imagery';
import { initialState } from './recent-imagery-reducers';

const serializeReponse = response =>
  response &&
  !!response.length &&
  response.map(r => ({
    ...r.attributes
  }));

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

const setRecentImageryData = createAction('setRecentImageryData');
const setRecentImageryDataStatus = createAction('setRecentImageryDataStatus');

const getData = createThunkAction('getData', params => dispatch => {
  if (this.getDataSource) {
    this.getDataSource.cancel();
  }
  this.getDataSource = CancelToken.source();

  getRecentTiles({ ...params, token: this.getDataSource.token })
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
            },
            settings: {
              selectedTileSource: source,
              clouds: cloudScore > clouds ? cloudScore : clouds
            }
          })
        );
      }
    })
    .catch(error => {
      console.info(error);
    });
});

const getMoreTiles = createThunkAction(
  'getMoreTiles',
  params => (dispatch, state) => {
    if (this.getMoreTilesSource) {
      this.getMoreTilesSource.cancel();
    }
    this.getMoreTilesSource = CancelToken.source();
    const { sources, dataStatus, bands } = params;

    axios
      .all([
        getTiles({ sources, token: this.getMoreTilesSource.token, bands }),
        getThumbs({ sources, token: this.getMoreTilesSource.token, bands })
      ])
      .then(
        axios.spread((tilesResponse, thumbsReponse) => {
          const serializedTiles = serializeReponse(tilesResponse);
          const serializedThumbs = serializeReponse(thumbsReponse);
          if (serializedTiles && serializedThumbs) {
            const data = state().recentImagery.data.slice();
            const requestedTiles =
              dataStatus.requestedTiles + serializedTiles.length;
            const haveAllData = requestedTiles === data.tiles.length;

            serializedTiles.forEach((item, i) => {
              if (i > 0) {
                const index = findIndex(data, d => d.source === item.source_id);
                if (index !== -1) {
                  data[index].tile_url = item.tile_url;
                }
              }
            });
            serializedThumbs.forEach(item => {
              const index = findIndex(data, d => d.source === item.source);
              if (index !== -1) {
                data[index].thumbnail_url = item.thumbnail_url;
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

const resetData = createThunkAction('resetData', () => dispatch => {
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

export default {
  setRecentImageryData,
  setRecentImageryDataStatus,
  setRecentImagerySettings,
  getData,
  getMoreTiles,
  resetData
};
