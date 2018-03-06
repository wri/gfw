export const initialState = {
  activated: false,
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
  activated: !state.activated
});

export default {
  setRecentImageryData,
  toogleRecentImagery
};
