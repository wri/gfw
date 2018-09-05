export const initialState = {
  data: [],
  dataStatus: {
    tilesPerRequest: 6,
    haveAllData: false,
    requestedTiles: 0,
    requestFails: 0
  },
  settings: {
    active: false,
    visible: false,
    minZoom: 9,
    selected: null,
    date: null,
    weeks: 13,
    clouds: 25,
    bands: 0
  }
};

const setRecentImageryData = (state, { payload }) => ({
  ...state,
  data: payload.data ? payload.data : state.data,
  dataStatus: {
    ...state.dataStatus,
    ...payload.dataStatus
  },
  settings: {
    ...state.settings,
    ...payload.settings
  }
});

const setRecentImageryDataStatus = (state, { payload }) => ({
  ...state,
  dataStatus: {
    ...state.dataStatus,
    ...payload
  }
});

const resetRecentImagery = (state) => ({
  ...state,
  ...initialState
});

export default {
  setRecentImageryData,
  setRecentImageryDataStatus,
  resetRecentImagery
};
