export const initialState = {
  activated: false,
  data: {
    url: '',
    bounds: [],
    cloudScore: 0,
    dateTime: '',
    instrument: ''
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
