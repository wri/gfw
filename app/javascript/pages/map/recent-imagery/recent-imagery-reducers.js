export const initialState = {
  enabled: false,
  data: {
    url: '',
    bounds: []
  }
};

const setRecentImageryData = (state, { payload }) => ({
  ...state,
  data: payload
});

const toogleRecentImagery = state => ({
  ...state,
  enabled: !state.enabled
});

export default {
  setRecentImageryData,
  toogleRecentImagery
};
