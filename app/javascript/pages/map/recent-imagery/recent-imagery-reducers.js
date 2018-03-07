export const initialState = {
  activated: false,
  data: {
    url: '',
    bounds: [],
    cloudScore: 0,
    dateTime: '',
    instrument: ''
  },
  settings: {
    styles: {
      top: 50,
      left: '50%'
    }
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

const setRecentImagerySettingsStyles = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    styles: payload
  }
});

export default {
  setRecentImageryData,
  toogleRecentImagery,
  setRecentImagerySettingsStyles
};
