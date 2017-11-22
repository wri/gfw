export const initialState = {
  selectedCountry: '',
  selectedRegion: '',
  countrySelectData: [],
  regionSelectData: [],
  totalCoverHeader: 0,
  totalForestHeader: 0,
  percentageForestHeader: 0,
  totalCoverLoss: 0
};

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
  setHeaderValues
};
