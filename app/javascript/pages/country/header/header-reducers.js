export const initialState = {
  isAreaLoading: false,
  isExtentLoading: false,
  countryArea: 0,
  regionArea: 0,
  subRegionArea: 0,
  treeCoverExtent: 0
};

const setAreaLoading = (state, { payload }) => ({
  ...state,
  isAreaLoading: payload
});

const setExtentLoading = (state, { payload }) => ({
  ...state,
  isExtentLoading: payload
});

const setCountryArea = (state, { payload }) => ({
  ...state,
  countryArea: payload
});

const setRegionArea = (state, { payload }) => ({
  ...state,
  regionArea: payload
});

const setSubRegionArea = (state, { payload }) => ({
  ...state,
  subRegionArea: payload
});

const setTreeCoverExtent = (state, { payload }) => ({
  ...state,
  treeCoverExtent: payload
});

export default {
  setAreaLoading,
  setExtentLoading,
  setCountryArea,
  setRegionArea,
  setSubRegionArea,
  setTreeCoverExtent
};
