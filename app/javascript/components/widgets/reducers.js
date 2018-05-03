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
  ...widgets
};

const setWidgetLoading = (state, { payload }) => ({
  ...state,
  [payload]: {
    ...state[payload],
    loading: true,
    error: false
  }
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
  setWidgetSettings,
  setWidgetLoading,
  setWidgetData
};
