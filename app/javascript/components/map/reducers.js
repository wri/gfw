import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_GAIN_DATASET,
  FOREST_LOSS_DATASET,
  FOREST_EXTENT_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_GAIN,
  FOREST_LOSS,
  FOREST_EXTENT
} from 'data/layers';
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
        dataset: POLITICAL_BOUNDARIES_DATASET,
        layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
        opacity: 1,
        visibility: true
      },
    ]
    //   // gain
    //   {
    //     dataset: FOREST_GAIN_DATASET,
    //     layers: [FOREST_GAIN],
    //     opacity: 1,
    //     visibility: true
    //   },
    //   // loss
    //   {
    //     dataset: FOREST_LOSS_DATASET,
    //     layers: [FOREST_LOSS],
    //     opacity: 1,
    //     visibility: true
    //   },
    //   // extent
    //   {
    //     dataset: FOREST_EXTENT_DATASET,
    //     layers: [FOREST_EXTENT],
    //     opacity: 1,
    //     visibility: true
    //   }
    // ]
  }
};

const setMapLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

const setMapSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
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
  [actions.setMapSettings]: setMapSettings,
  [actions.setMapInteractions]: setMapInteractions,
  [actions.setMapInteractionSelected]: setMapInteractionSelected,
  [actions.clearMapInteractions]: clearMapInteractions
};
