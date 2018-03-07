import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getRecentTiles, getTiles } from 'services/recent-imagery';

const setRecentImageryData = createAction('setRecentImageryData');
const toogleRecentImagery = createAction('toogleRecentImagery');
const setRecentImagerySettingsStyles = createAction(
  'setRecentImagerySettingsStyles'
);
const setRecentImageryShowSettings = createAction(
  'setRecentImageryShowSettings'
);

const getData = createThunkAction('getData', params => dispatch => {
  getRecentTiles(params)
    .then(response => {
      if (response.data.data.length) {
        dispatch(setRecentImageryData(response.data.data));
      }
    })
    .catch(error => {
      console.error(error);
    });
});

const getMoreTiles = createThunkAction('getMoreTiles', params => dispatch => {
  getTiles(params)
    .then(response => {
      if (response.data.data.length) {
        const data = response.data.data[0].attributes;
        const sources = [];
        response.data.data.forEach((item, i) => {
          if (i !== 0) {
            sources.push(item.attributes.source);
          }
        });
        dispatch(
          setRecentImageryData({
            url: data.tile_url,
            bounds: data.bbox.geometry.coordinates,
            cloudScore: data.cloud_score,
            dateTime: data.date_time,
            instrument: data.instrument,
            sources
          })
        );
      }
    })
    .catch(error => {
      console.error(error);
    });
});

export default {
  setRecentImageryData,
  toogleRecentImagery,
  setRecentImagerySettingsStyles,
  setRecentImageryShowSettings,
  getData,
  getMoreTiles
};
