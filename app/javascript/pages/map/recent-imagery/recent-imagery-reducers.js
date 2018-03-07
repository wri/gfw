export const initialState = {
  active: false,
  showSettings: true,
  data: {},
  settings: {
    styles: {
      top: 50,
      left: '50%'
    },
    tileIndex: 0
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
