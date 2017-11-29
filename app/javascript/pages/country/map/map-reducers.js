export const initialState = {
  isLoading: true,
  layersSpec: {},
  layers: ['forest2000', 'ifl_2013_deg']
};

const setLayersLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setLayers = (state, { payload }) => ({
  ...state,
  layers: payload
});

const setLayersSpec = (state, { payload }) => ({
  ...state,
  layersSpec: payload
});

export default {
  setLayersLoading,
  setLayers,
  setLayersSpec
};
