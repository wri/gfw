export const initialState = {
  enabled: false,
  needEvents: false,
  data: {}
};

const setRecentImageryData = (state, { payload }) => ({
  ...state,
  data: payload
});

const toogleRecentImagery = state => ({
  ...state,
  enabled: !state.enabled
});

const setRecentImageryEvents = (state, { payload }) => ({
  ...state,
  needEvents: payload
});

export default {
  setRecentImageryData,
  toogleRecentImagery,
  setRecentImageryEvents
};
