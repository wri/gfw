import WIDGETS_CONFIG from '../../widget-config.json';

export const initialState = {
  loading: false,
  error: false,
  activeAlert: {},
  data: {},
  ...WIDGETS_CONFIG.gladAlerts
};

export const setGladAlertsData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: payload
});

export const setGladAlertsSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

export const setGladAlertsLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

export const setActiveAlert = (state, { payload }) => ({
  ...state,
  activeAlert: payload
});

export default {
  setGladAlertsData,
  setGladAlertsSettings,
  setGladAlertsLoading,
  setActiveAlert
};
