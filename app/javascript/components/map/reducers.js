import * as actions from './actions';

export const initialState = {
  loading: false,
  data: {
    interactions: {
      latlng: {},
      data: {},
      selected: ''
    }
  },
  settings: {
    center: {
      lat: 27,
      lng: 12
    },
    zoom: 2,
    attributionControl: false,
    mapStyle: 'mapbox://styles/resourcewatch/cjt46ozf40a5j1fswk8fqxgyc',
    maxZoom: 18,
    minZoom: 2,
    basemap: {
      value: 'default'
    },
    label: 'default',
    bbox: null,
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
        visibility: true
      },
      // gain
      {
        dataset: '70e2549c-d722-44a6-a8d7-4a385d78565e',
        layers: ['3b22a574-2507-4b4a-a247-80057c1a1ad4'],
        opacity: 1,
        visibility: true
      },
      // loss
      {
        dataset: '897ecc76-2308-4c51-aeb3-495de0bdca79',
        layers: ['c3075c5a-5567-4b09-bc0d-96ed1673f8b6'],
        opacity: 1,
        visibility: true
      },
      // extent
      {
        dataset: '044f4af8-be72-4999-b7dd-13434fc4a394',
        layers: ['78747ea1-34a9-4aa7-b099-bdb8948200f4'],
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

const setMapInteraction = (state, { payload }) => {
  const interactions = payload.features.reduce(
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
        latlng: {
          lat: payload.lngLat[1],
          lng: payload.lngLat[0]
        },
        data: interactions
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
      latlng: {},
      data: {},
      selected: ''
    }
  }
});

export default {
  [actions.setMapLoading]: setMapLoading,
  [actions.setMapInteraction]: setMapInteraction,
  [actions.setMapInteractionSelected]: setMapInteractionSelected,
  [actions.clearMapInteractions]: clearMapInteractions
};
