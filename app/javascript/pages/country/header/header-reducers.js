export const initialState = {
  selectedAdmin0: '',
  selectedAdmin1: '',
  selectedAdmin2: '',
  admin0SelectData: [],
  admin1SelectData: [],
  admin2SelectData: []
};

const setHeaderSelectValues = (state, { payload }) => ({
  ...state,
  selectedAdmin0: payload.selectedAdmin0,
  selectedAdmin1: payload.selectedAdmin1,
  selectedAdmin2: payload.selectedAdmin2,
  admin0SelectData: payload.admin0SelectData,
  admin1SelectData: payload.admin1SelectData,
  admin2SelectData: payload.admin2SelectData
});

const setHeaderValues = (state, { payload }) => ({
  ...state,
  selectedCountry: payload.selectedCountry,
  selectedRegion: payload.selectedRegion,
  countrySelectData: payload.countrySelectData,
  regionSelectData: payload.regionSelectData,
  totalCoverHeader: payload.totalCoverHeader,
  totalForestHeader: payload.totalForestHeader,
  percentageForestHeader: payload.percentageForestHeader,
  totalCoverLoss: payload.totalCoverLoss
});

export default {
  setHeaderSelectValues,
  setHeaderValues
};
