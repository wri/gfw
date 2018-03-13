export const initialState = {
  active: false,
  showSettings: false,
  haveAllData: false,
  data: {},
  settings: {
    styles: {
      top: 50,
      left: '50%'
    },
    selectedTileIndex: 0,
    date: null,
    weeks: 13
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

const setRecentImagerySettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

const setRecentImageryShowSettings = (state, { payload }) => ({
  ...state,
  showSettings: payload
});

export default {
  setRecentImageryData,
  toogleRecentImagery,
  setRecentImagerySettings,
  setRecentImageryShowSettings
};
