export const initialState = {
  activated: false,
  activatedFromUrl: false,
  data: {
    url: '',
    bounds: []
  }
};

const setRecentImageryData = (state, { payload }) => ({
  ...state,
  data: payload
});

const toogleRecentImagery = (state, { payload }) => ({
  ...state,
  activated: !state.activated,
  activatedFromUrl: payload ? payload.activatedFromUrl : state.activatedFromUrl
});

export default {
  setRecentImageryData,
  toogleRecentImagery
};
