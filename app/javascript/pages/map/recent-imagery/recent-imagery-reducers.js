export const initialState = {
  active: false,
  showSettings: false,
  data: {
    url: '',
    bounds: [],
    cloudScore: 0,
    dateTime: '',
    instrument: '',
    sources: []
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
  active: !state.active
});

const setRecentImagerySettingsStyles = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    styles: payload
  }
});

const setRecentImageryShowSettings = (state, { payload }) => ({
  ...state,
  showSettings: payload
});

export default {
  setRecentImageryData,
  toogleRecentImagery,
  setRecentImagerySettingsStyles,
  setRecentImageryShowSettings
};
