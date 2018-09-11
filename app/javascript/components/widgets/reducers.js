import * as actions from './actions';
import * as Widgets from './manifest';

const widgets = {};
Object.keys(Widgets).forEach(key => {
  widgets[key] = {
    name: key,
    loading: false,
    error: false,
    data: {},
    ...Widgets[key].initialState
  };
});

export const initialState = {
  global: {},
  ...widgets
};

const setGlobalData = (state, { payload }) => ({
  ...state,
  global: {
    ...state.global,
    ...payload
  }
});

const setWidgetLoading = (state, { payload }) => ({
  ...state,
  [payload]: {
    ...state[payload],
    loading: true,
    error: false
  }
});

const setWidgetActive = (state, { payload }) => ({
  ...state,
  active: payload
});

const setWidgetSettings = (state, { payload }) => ({
  ...state,
  [payload.widget]: {
    ...state[payload.widget],
    settings: {
      ...state[payload.widget].settings,
      ...payload.settings
    }
  }
});

const setWidgetData = (state, { payload }) => ({
  ...state,
  [payload.widget]: {
    ...state[payload.widget],
    data: payload.data,
    config: {
      ...state[payload.widget].config,
      ...payload.config
    },
    settings: {
      ...state[payload.widget].settings,
      ...payload.settings
    },
    loading: false,
    error: payload.error
  }
});

export default {
  [actions.setWidgetSettings]: setWidgetSettings,
  [actions.setWidgetLoading]: setWidgetLoading,
  [actions.setWidgetData]: setWidgetData,
  [actions.setWidgetActive]: setWidgetActive,
  [actions.setGlobalData]: setGlobalData
};
