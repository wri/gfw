import { createSelector, createStructuredSelector } from 'reselect';

import { buildLocationName, buildFullLocationName } from 'utils/format';

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
    if (location.type === 'country') {
      return buildLocationName(location, { adms, adm1s, adm2s });
    }
    return '';
  }
);

export const getFullLocationName = createSelector(
  [selectLocation, selectAdmins, selectAdmin1s, selectAdmin2s],
  (location, adms, adm1s, adm2s) => {
    if (location.type === 'draw') return 'custom area analysis';
    if (location.type === 'country') {
      return buildFullLocationName(location, { adms, adm1s, adm2s });
    }
    return 'area analysis';
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
      layers.filter(l => !l.isBoundary && !l.isRecentImagery).map(l => ({
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
  fullLocationName: getFullLocationName,
  layers: getActiveLayers
});
