import { createSelector, createStructuredSelector } from 'reselect';

import { getActiveLayers } from 'components/map-v2/selectors';

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
        activeLocation = adms && adms.find(a => a.value === country);
      }
    }
    return activeLocation && activeLocation.label;
  }
);

export const getDataFromLayers = createSelector(
  [getActiveLayers, selectData, getLocationName, selectLocation],
  (layers, data, locationName, location) => {
    if (!layers || !layers.length || !data) return null;

    return [
      {
        label:
          location.type !== 'draw'
            ? `${locationName} total area`
            : 'selected area',
        value: data.areaHa
      }
    ].concat(
      layers.filter(l => !l.isBoundary).map(l => ({
        label: l.name,
        value: data[l.analysisKey],
        color: l.color,
        ...l.params,
        ...l.decodeParams
      }))
    );
  }
);

export const getDrawAnalysisProps = createStructuredSelector({
  location: selectLocation,
  query: selectQuery,
  data: getDataFromLayers,
  loading: selectLoading,
  locationName: getLocationName,
  layers: getActiveLayers
});
