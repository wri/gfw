import WIDGETS_CONFIG from './widget-config.json';

const widgets = {};
Object.keys(WIDGETS_CONFIG).forEach(key => {
  widgets[key] = {
    name: key,
    loading: false,
    error: false,
    data: {},
    ...WIDGETS_CONFIG[key]
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
    loading: false,
    error: payload.error
  }
});

export default {
  setWidgetSettings,
  setWidgetLoading,
  setWidgetData
};
