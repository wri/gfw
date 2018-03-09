import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import findIndex from 'lodash/findIndex';

import { getRecentTiles, getTiles, getThumbs } from 'services/recent-imagery';

const setRecentImageryData = createAction('setRecentImageryData');
const toogleRecentImagery = createAction('toogleRecentImagery');
const setRecentImagerySettings = createAction('setRecentImagerySettings');
const setRecentImageryShowSettings = createAction(
  'setRecentImageryShowSettings'
);

const getData = createThunkAction('getData', params => dispatch => {
  getRecentTiles(params)
    .then(response => {
      if (response.data.data.length) {
        dispatch(setRecentImageryData({ data: response.data.data }));
        dispatch(setRecentImagerySettings({ selectedTileIndex: 0 }));
      }
    })
    .catch(error => {
      console.error(error);
    });
});

const getMoreTiles = createThunkAction(
  'getMoreTiles',
  params => (dispatch, state) => {
    getTiles(params)
      .then(getTilesResponse => {
        getThumbs(params)
          .then(getThumbsResponse => {
            if (
              getTilesResponse.data.data.attributes.length &&
              getThumbsResponse.data.data.attributes.length
            ) {
              const data = state().recentImagery.data.slice();
              getTilesResponse.data.data.attributes.forEach((item, i) => {
                if (i > 0) {
                  const index = findIndex(
                    data,
                    d => d.attributes.source === item.source_id
                  );
                  data[index].attributes.tile_url = item.tile_url;
                }
              });
              getThumbsResponse.data.data.attributes.forEach(item => {
                const index = findIndex(
                  data,
                  d => d.attributes.source === item.source
                );
                data[index].attributes.thumbnail_url = item.thumbnail_url;
              });
              dispatch(
                setRecentImageryData({
                  data,
                  haveAllData: true
                })
              );
            }
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }
);

export default {
  setRecentImageryData,
  toogleRecentImagery,
  setRecentImagerySettings,
  setRecentImageryShowSettings,
  getData,
  getMoreTiles
};
