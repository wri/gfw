import * as actions from './actions';

export const initialState = {
  latlng: {},
  interactions: {},
  selected: ''
};

const setInteraction = (state, { payload }) => {
  const interactions = payload.features.reduce((obj, next) => ({
    ...obj,
    [next.layer.source]: {
      ...next.properties
    }
  }), {});

  return {
    ...state,
    latlng: {
      lat: payload.lngLat[1],
      lng: payload.lngLat[0]
    },
    interactions
  };
};

const setInteractionSelected = (state, { payload }) => ({
  ...state,
  selected: payload
});

const clearInteractions = state => ({
  ...state,
  interactions: {},
  latlng: null,
  selected: ''
});

export default {
  [actions.setInteraction]: setInteraction,
  [actions.setInteractionSelected]: setInteractionSelected,
  [actions.clearInteractions]: clearInteractions
};
