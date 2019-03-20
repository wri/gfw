import * as actions from 'pages/map/components/recent-imagery/recent-imagery-actions';

export const initialState = {
  loading: false,
  error: false,
  loadingMoreTiles: false,
  data: [],
  dataStatus: {
    tilesPerRequest: 2,
    haveAllData: false,
    requestedTiles: 0,
    requestFails: 0
  },
  settings: {
    selected: null,
    selectedIndex: 0,
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

const resetRecentImageryData = () => ({
  ...initialState
});

const setRecentImageryLoading = (state, { payload }) => ({
  ...state,
  loading: payload.loading,
  error: payload.error
});

const setRecentImageryLoadingMoreTiles = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  [actions.setRecentImageryData]: setRecentImageryData,
  [actions.setRecentImageryDataStatus]: setRecentImageryDataStatus,
  [actions.resetRecentImageryData]: resetRecentImageryData,
  [actions.setRecentImageryLoading]: setRecentImageryLoading,
  [actions.setRecentImageryLoadingMoreTiles]: setRecentImageryLoadingMoreTiles
};
