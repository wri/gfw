import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getRecentTiles } from 'services/recent-imagery';

const toogleRecentImagery = createAction('toogleRecentImagery');
const setRecentImageryEventsEnabled = createAction(
  'setRecentImageryEventsEnabled'
);

const setLayer = createThunkAction('setLayer', params => dispatch => {
  getRecentTiles(params)
    .then(response => {
      if (response.data.data.length) {
        params.middleView.toggleLayer('sentinel_tiles', {
          urlTemplate: response.data.data[0].attributes.tile_url
        });
        dispatch(setRecentImageryEventsEnabled(false));
      }
    })
    .catch(error => {
      console.error(error);
    });
});

const updateLayer = createThunkAction('updateLayer', params => dispatch => {
  getRecentTiles(params)
    .then(response => {
      if (response.data.data.length) {
        params.middleView.updateLayer('sentinel_tiles', {
          urlTemplate: response.data.data[0].attributes.tile_url
        });
        dispatch(setRecentImageryEventsEnabled(false));
      }
    })
    .catch(error => {
      console.error(error);
    });
});

export default {
  toogleRecentImagery,
  setRecentImageryEventsEnabled,
  setLayer,
  updateLayer
};
