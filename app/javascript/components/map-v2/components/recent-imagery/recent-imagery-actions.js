import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios, { CancelToken } from 'axios';
import { setComponentStateToUrl } from 'utils/stateToUrl';

import { getRecentTiles, getTiles, getThumbs } from 'services/recent-imagery';
import { initialState } from './recent-imagery-reducers';

const serializeReponse = response =>
  response &&
  !!response.length &&
  response.map(r => ({
    ...r.attributes
  }));

const setRecentImageryData = createAction('setRecentImageryData');
const setRecentImageryDataStatus = createAction('setRecentImageryDataStatus');
const resetRecentImageryData = createAction('resetRecentImageryData');
const setRecentImageryLoading = createAction('setRecentImageryLoading');

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

const getData = createThunkAction('getData', params => dispatch => {
  if (this.getDataSource) {
    this.getDataSource.cancel();
  }
  this.getDataSource = CancelToken.source();
  dispatch(setRecentImageryLoading(true));
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

export default {
  setRecentImageryData,
  setRecentImageryDataStatus,
  setRecentImagerySettings,
  setRecentImageryLoading,
  resetRecentImageryData,
  getData,
  getMoreTiles
};
