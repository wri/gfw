export const initialState = {
  isLoading: false,
  data: {
    fao: {},
    rank: 0
  }
};

const setFAOForestIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setFAOForestData = (state, { payload }) => ({
  ...state,
  isLoading: false,
  data: {
    ...payload
  }
});

export default {
  setFAOForestIsLoading,
  setFAOForestData
};
