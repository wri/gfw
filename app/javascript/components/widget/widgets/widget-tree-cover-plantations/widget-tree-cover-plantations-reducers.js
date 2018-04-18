import WIDGETS_CONFIG from '../../widget-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {},
  ...WIDGETS_CONFIG.treeCoverPlantations
};

const setTreeCoverPlantationsLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setTreeCoverPlantationsData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: payload
});

const setTreeCoverPlantationsSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

export default {
  setTreeCoverPlantationsLoading,
  setTreeCoverPlantationsData,
  setTreeCoverPlantationsSettings
};
