import { createSelector, createStructuredSelector } from 'reselect';

const selectLocation = state => state.location && state.location.payload;
const selectLoading = state =>
  state.analysis.loading || state.datasets.loading || state.geostore.loading;
const selectQuery = state => state.location && state.location.query;
const selectData = state => state.analysis.data;
const selectAdmins = state => state.countryData.countries;
const selectAdmin1s = state => state.countryData.regions;
const selectAdmin2s = state => state.countryData.subRegions;

export const getLocationName = createSelector(
  [selectLocation, selectAdmins, selectAdmin1s, selectAdmin2s],
  (location, adms, adm1s, adm2s) => {
    if (location.type === 'draw') return 'custom area analysis';
    const { type, country, region, subRegion } = location;
    let activeLocation = { label: '' };
    if (type === 'country') {
      if (subRegion) {
        activeLocation =
          adm2s && adm2s.find(a => a.value === parseInt(subRegion, 10));
      } else if (region) {
        activeLocation =
          adm1s && adm1s.find(a => a.value === parseInt(region, 10));
      } else if (country) {
        activeLocation =
          adms && adms.find(a => a.value === parseInt(country, 10));
      }
    }
    return activeLocation && activeLocation.label;
  }
);

export const getDrawAnalysisProps = createStructuredSelector({
  location: selectLocation,
  query: selectQuery,
  data: selectData,
  loading: selectLoading,
  locationName: getLocationName
});
