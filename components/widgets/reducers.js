import * as actions from './actions';

export const initialState = {
  loading: true,
  error: false,
  data: {},
  chartSettings: {},
  settings: {},
  interactions: {},
  category: 'summary',
  activeWidget: '',
  showMap: false,
};

// reducers for all widgets parent wrapper component
const setWidgetsData = (state, { payload }) => ({
  ...state,
  data: {
    ...state.data,
    ...payload,
  },
  loading: false,
  error: false,
});

const setWidgetsChartSettings = (state, { payload }) => ({
  ...state,
  chartSettings: {
    ...state.chartSettings,
    ...payload,
  },
});

const setActiveWidget = (state, { payload }) => ({
  ...state,
  activeWidget: payload,
  showMap: true,
});

const setShowMap = (state, { payload }) => ({
  ...state,
  showMap: payload,
});

const setWidgetsCategory = (state, { payload }) => ({
  ...state,
  category: payload || initialState.category,
});

const setWidgetsSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload,
  },
});

const setWidgetSettingsByKey = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    [payload.key]: {
      ...state.settings?.[payload.key],
      ...payload.change,
    },
  },
});

const setWidgetInteractionByKey = (state, { payload }) => ({
  ...state,
  interactions: {
    ...state.interactions,
    [payload?.key]: payload?.payload,
  },
});

const setWidgetsLoading = (state, { payload }) => ({
  ...state,
  loading: payload.loading,
  error: payload.error,
});

export default {
  [actions.setWidgetsData]: setWidgetsData,
  [actions.setWidgetsChartSettings]: setWidgetsChartSettings,
  [actions.setShowMap]: setShowMap,
  [actions.setWidgetsCategory]: setWidgetsCategory,
  [actions.setActiveWidget]: setActiveWidget,
  [actions.setWidgetsSettings]: setWidgetsSettings,
  [actions.setWidgetSettingsByKey]: setWidgetSettingsByKey,
  [actions.setWidgetInteractionByKey]: setWidgetInteractionByKey,
  [actions.setWidgetsLoading]: setWidgetsLoading,
};
