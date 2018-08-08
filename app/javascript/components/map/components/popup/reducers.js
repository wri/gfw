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
    latlng: payload.latlng,
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
  setInteraction,
  setInteractionSelected,
  clearInteractions
};
