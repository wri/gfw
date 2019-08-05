import * as actions from './actions';

export const initialState = {
  loading: false,
  data: {
    interactions: {
      latlng: {},
      interactions: {},
      selected: ''
    }
  },
  settings: {
    center: {
      lat: 27,
      lng: 12
    },
    zoom: 2,
    bearing: 0,
    pitch: 0,
    minZoom: 2,
    maxZoom: 19,
    basemap: {
      value: 'default'
    },
    labels: true,
    roads: false,
    bbox: [],
    canBound: true,
    drawing: false,
    datasets: [
      // admin boundaries
      {
        dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
        layers: [
          '6f6798e6-39ec-4163-979e-182a74ca65ee',
          'c5d1e010-383a-4713-9aaa-44f728c0571c'
        ],
        opacity: 1,
        visibility: true,
        showBoth: true
      },
      // projected carbon storage
      {
        dataset: 'b7a34457-1d8a-456e-af46-876e0b42fb96',
        layers: ['4d0234b1-6f26-4385-8221-46bb0444d5d8'],
        compareLayers: ['c9e48a9f-2dca-4233-9400-0b5e4e07674f'],
        opacity: 1,
        visibility: true
      }
    ]
  }
};

const setMapLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

const setMapInteractions = (state, { payload }) => {
  const interactions =
    payload &&
    payload.features.reduce(
      (obj, next) => ({
        ...obj,
        [next.layer.source]: {
          id: next.id,
          data: next.properties,
          geometry: next.geometry
        }
      }),
      {}
    );

  return {
    ...state,
    data: {
      ...state.data,
      interactions: {
        ...state.data.interactions,
        interactions,
        latlng: {
          lat: payload.lngLat[1],
          lng: payload.lngLat[0]
        }
      }
    }
  };
};

const setMapInteractionSelected = (state, { payload }) => ({
  ...state,
  data: {
    ...state.data,
    interactions: {
      ...state.data.interactions,
      selected: payload
    }
  }
});

const clearMapInteractions = state => ({
  ...state,
  data: {
    ...state.data,
    interactions: {
      interactions: {},
      latlng: null,
      selected: ''
    }
  }
});

export default {
  [actions.setMapLoading]: setMapLoading,
  [actions.setMapInteractions]: setMapInteractions,
  [actions.setMapInteractionSelected]: setMapInteractionSelected,
  [actions.clearMapInteractions]: clearMapInteractions
};
