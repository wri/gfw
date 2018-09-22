import * as actions from './actions';
import allWidgets from './manifest';

export const initialState = {
  loading: false,
  error: false,
  data: {},
  settings: {},
  widgets: {
    // ...Object.keys(allWidgets).reduce((obj, key) => ({
    //   ...obj,
    //   [key]: {
    //     loading: false,
    //     error: false,
    //     data: {}
    //   }
    // }), {})
  }
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

export default {
  // widgets
  [actions.setWidgetsData]: setWidgetsData,
  [actions.setWidgetsSettings]: setWidgetsSettings,
  [actions.setWidgetsLoading]: setWidgetsLoading,
  // widget
  [actions.setWidgetData]: setWidgetData,
  [actions.setWidgetLoading]: setWidgetLoading
};
