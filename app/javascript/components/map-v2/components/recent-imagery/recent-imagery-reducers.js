import * as actions from './recent-imagery-actions';

export const initialState = {
  loading: true,
  data: [],
  dataStatus: {
    tilesPerRequest: 6,
    haveAllData: false,
    requestedTiles: 0,
    requestFails: 0
  },
  settings: {
    visible: false,
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

const resetRecentImageryData = () => ({
  ...initialState
});

const setRecentImageryLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

export default {
  [actions.setRecentImageryData]: setRecentImageryData,
  [actions.setRecentImageryDataStatus]: setRecentImageryDataStatus,
  [actions.resetRecentImageryData]: resetRecentImageryData,
  [actions.setRecentImageryLoading]: setRecentImageryLoading
};
