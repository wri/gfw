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
        ...payload.data,
        label: payload.label,
        config: payload.config
      }
    }
  };
};

const setInteractionSelected = (state, { payload }) => ({
  ...state,
  selected: payload
});

export default {
  setInteraction,
  setInteractionSelected
};
