import * as actions from './actions';

export const initialState = {
  loading: true,
  error: false,
  data: {},
  settings: {}
};

// reducers for all widgets parent wrapper component
const setWidgetsData = (state, { payload }) => ({
  ...state,
  data: {
    ...state.data,
    ...payload
  },
  loading: false,
  error: false
});

const setWidgetSettingsByKey = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    [payload.key]: {
      ...state.settings?.[payload.key],
      ...payload.change
    }
  },
});

const setWidgetsLoading = (state, { payload }) => ({
  ...state,
  loading: payload.loading,
  error: payload.error
});

export default {
  [actions.setWidgetsData]: setWidgetsData,
  [actions.setWidgetSettingsByKey]: setWidgetSettingsByKey,
  [actions.setWidgetsLoading]: setWidgetsLoading
};
