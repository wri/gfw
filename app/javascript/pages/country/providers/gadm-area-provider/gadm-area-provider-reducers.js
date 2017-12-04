export const initialState = {
  isLoading: false,
  countryArea: 0,
  regionArea: 0,
  subRegionArea: 0
};

const setLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setGadmCountryArea = (state, { payload }) => ({
  ...state,
  countryArea: payload
});

const setGadmRegionArea = (state, { payload }) => ({
  ...state,
  regionArea: payload
});

const setGadmSubRegionArea = (state, { payload }) => ({
  ...state,
  subRegionArea: payload
});

export default {
  setLoading,
  setGadmCountryArea,
  setGadmRegionArea,
  setGadmSubRegionArea
};
