export const initialState = {
  active: false,
  showSettings: true,
  haveAllData: false,
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
  data: payload.data,
  haveAllData: payload.haveAllData || false
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
