import * as actions from './actions';

export const initialState = {
  loading: false,
  error: false,
  data: {},
  settings: {},
  widgets: {}
};

// reducers for all widgets parent wrapper component
const setWidgetsData = (state, { payload }) => ({
  ...state,
  data: {
    ...state.data,
    ...payload
  },
  loading: false
});

const setWidgetsSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

const setWidgetsLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

// reducers for widget component
const setWidgetData = (state, { payload }) => ({
  ...state,
  widgets: {
    ...state.widgets,
    [payload.widget]: {
      ...state.widgets[payload.widget],
      data: payload.data,
      loading: false,
      error: false
    }
  }
});

const setWidgetLoading = (state, { payload }) => ({
  ...state,
  widgets: {
    ...state.widgets,
    [payload.widget]: {
      ...state.widgets[payload.widget],
      loading: payload.loading,
      error: payload.error
    }
  }
});

const removeWidget = (state, { payload }) => {
  const widgets = state.widgets;
  delete widgets[payload];
  return {
    ...state,
    widgets
  };
};

export default {
  // widgets
  [actions.setWidgetsData]: setWidgetsData,
  [actions.setWidgetsSettings]: setWidgetsSettings,
  [actions.setWidgetsLoading]: setWidgetsLoading,
  // widget
  [actions.setWidgetData]: setWidgetData,
  [actions.setWidgetLoading]: setWidgetLoading,
  [actions.removeWidget]: removeWidget
};
