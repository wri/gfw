export const initialState = {
  enabled: false,
  eventsEnabled: false
};

const toogleRecentImagery = state => ({
  ...state,
  enabled: !state.enabled
});

const setRecentImageryEventsEnabled = (state, { payload }) => ({
  ...state,
  eventsEnabled: payload
});

export default {
  toogleRecentImagery,
  setRecentImageryEventsEnabled
};
