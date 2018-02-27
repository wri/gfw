export const initialState = {
  enabled: false
};

const toogleRecentImagery = state => ({
  ...state,
  enabled: !state.enabled
});

export default {
  toogleRecentImagery
};
