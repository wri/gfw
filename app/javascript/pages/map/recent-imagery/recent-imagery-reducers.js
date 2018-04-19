export const initialState = {
  active: false,
  showSettings: false,
  data: {},
  dataStatus: {
    tilesPerRequest: 6,
    haveAllData: false,
    requestedTiles: 0,
    requestFails: 0
  },
  settings: {
    styles: {
      top: 50,
      left: '50%'
    },
    layerSlug: 'sentinel_tiles',
    minZoom: 9,
    thumbsToShow: 5,
    selectedTileIndex: 0,
    date: null,
    weeks: 13,
    clouds: 25
  }
};

const toogleRecentImagery = state => ({
  ...state,
  active: !state.active
});

const setRecentImageryData = (state, { payload }) => ({
  ...state,
  data: payload.data ? payload.data : state.data,
  dataStatus: {
    ...state.dataStatus,
    ...payload.dataStatus
  }
});

const setRecentImageryDataStatus = (state, { payload }) => ({
  ...state,
  dataStatus: {
    ...state.dataStatus,
    ...payload
  }
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
  toogleRecentImagery,
  setRecentImageryData,
  setRecentImageryDataStatus,
  setRecentImagerySettings,
  setRecentImageryShowSettings
};
