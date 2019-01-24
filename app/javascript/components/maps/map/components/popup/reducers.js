import * as actions from './actions';

export const initialState = {
  latlng: {},
  interactions: {},
  selected: ''
};

const setInteraction = (state, { payload }) => {
  const interactions =
    state.latlng === payload.latlng ? state.interactions : {};

  return {
    ...state,
    latlng: payload.latlng || {
      lat: payload.lngLat[1],
      lng: payload.lngLat[0]
    },
    interactions: {
      ...interactions,
      [payload.id]: {
        ...payload
      }
    }
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
