import * as actions from './recent-imagery-actions';

export const initialState = {
  active: false,
  visible: false,
  showSettings: false,
  isTimelineOpen: false,
  data: {},
  dataStatus: {
    tilesPerRequest: 6,
    haveAllData: false,
    requestedTiles: 0,
    requestFails: 0
  },
  settings: {
    styles: {
      top: 90,
      left: '50%'
    },
    layerSlug: 'sentinel_tiles',
    minZoom: 9,
    thumbsToShow: 5,
    selectedTileSource: null,
    date: null,
    weeks: 13,
    clouds: 25,
    bands: 0
  }
};

const toogleRecentImagery = state => ({
  ...state,
  active: !state.active,
  visible: !state.active
});

const setVisible = (state, { payload }) => ({
  ...state,
  visible: payload
});

const setTimelineFlag = (state, { payload }) => ({
  ...state,
  isTimelineOpen: payload
});

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
  [actions.toogleRecentImagery]: toogleRecentImagery,
  [actions.setVisible]: setVisible,
  [actions.setTimelineFlag]: setTimelineFlag,
  [actions.setRecentImageryData]: setRecentImageryData,
  [actions.setRecentImageryDataStatus]: setRecentImageryDataStatus,
  [actions.setRecentImagerySettings]: setRecentImagerySettings,
  [actions.setRecentImageryShowSettings]: setRecentImageryShowSettings
};
