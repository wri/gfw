import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getRecentTiles } from 'services/recent-imagery';

const setRecentImageryData = createAction('setRecentImageryData');
const toogleRecentImagery = createAction('toogleRecentImagery');
const setRecentImageryEvents = createAction('setRecentImageryEvents');

const setLayer = createThunkAction('setLayer', params => dispatch => {
  getRecentTiles(params)
    .then(response => {
      if (response.data.data.length) {
        const data = response.data.data[0].attributes;

        params.middleView.toggleLayer('sentinel_tiles', {
          urlTemplate: data.tile_url
        });
        dispatch(
          setRecentImageryData({
            url: data.tile_url,
            bounds: data.bbox.geometry.coordinates
          })
        );
        dispatch(setRecentImageryEvents(true));
        dispatch(
          addBoundsPolygon({
            map: params.middleView.map,
            bounds: data.bbox.geometry.coordinates
          })
        );
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
        const data = response.data.data[0].attributes;

        params.middleView.updateLayer('sentinel_tiles', {
          urlTemplate: data.tile_url
        });
        dispatch(
          setRecentImageryData({
            url: data.tile_url,
            bounds: data.bbox.geometry.coordinates
          })
        );
        dispatch(setRecentImageryEvents(true));
      }
    })
    .catch(error => {
      console.error(error);
    });
});

const addBoundsPolygon = createThunkAction('addBoundPolygon', params => () => {
  const { map, bounds } = params;
  const coords = [];
  bounds.forEach(item => {
    coords.push({
      lat: item[0],
      lng: item[1]
    });
  });
  const boundsPolygon = new google.maps.Polygon({
    paths: coords,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35
  });
  boundsPolygon.setMap(map);
});

const setEvents = createThunkAction('setEvents', params => dispatch => {
  const { map } = params.middleView;
  let clickTimeout = null;

  dispatch(removeEvents({ map }));
  map.addListener('click', e => {
    clickTimeout = setTimeout(() => {
      console.log(e); // eslint-disable-line
    }, 200);
  });
  map.addListener('dblclick', () => {
    clearTimeout(clickTimeout);
  });
  map.addListener('dragend', () => {
    dispatch(
      updateLayer({
        middleView: params.middleView,
        latitude: map.getCenter().lng(),
        longitude: map.getCenter().lat(),
        start: '2016-01-01',
        end: '2016-09-01'
      })
    );
  });
  dispatch(setRecentImageryEvents(false));
});

const removeEvents = createThunkAction('removeEvents', params => () => {
  const { map } = params;
  google.maps.event.clearListeners(map, 'click'); // eslint-disable-line
  google.maps.event.clearListeners(map, 'dblclick'); // eslint-disable-line
  google.maps.event.clearListeners(map, 'dragend'); // eslint-disable-line
});

export default {
  setRecentImageryData,
  toogleRecentImagery,
  setRecentImageryEvents,
  setLayer,
  updateLayer,
  addBoundsPolygon,
  setEvents,
  removeEvents
};
