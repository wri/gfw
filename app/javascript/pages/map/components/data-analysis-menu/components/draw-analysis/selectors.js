import { createSelector, createStructuredSelector } from 'reselect';

import { buildLocationName, buildFullLocationName } from 'utils/format';

import { getActiveLayers } from 'components/map-v2/selectors';

const selectLocation = state => state.location && state.location.payload;
const selectLoading = state =>
  state.analysis.loading || state.datasets.loading || state.geostore.loading;
const selectData = state => state.analysis.data;
const selectAdmins = state => state.countryData.countries;
const selectAdmin1s = state => state.countryData.regions;
const selectAdmin2s = state => state.countryData.subRegions;

export const getLocationName = createSelector(
  [selectLocation, selectAdmins, selectAdmin1s, selectAdmin2s],
  (location, adms, adm1s, adm2s) => {
    if (location.type === 'geostore') return 'custom area analysis';
    if (location.type === 'country') {
      return buildLocationName(location, { adms, adm1s, adm2s });
    }
    return '';
  }
);

export const getFullLocationName = createSelector(
  [selectLocation, selectAdmins, selectAdmin1s, selectAdmin2s],
  (location, adms, adm1s, adm2s) => {
    if (location.type === 'geostore') return 'custom area analysis';
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
    const { type } = location;
    const routeType = type === 'country' ? 'admin' : type;

    return [
      {
        label:
          location.type !== 'geostore'
            ? `${locationName} total area`
            : 'selected area',
        value: data.areaHa || 0
      }
    ].concat(
      layers
        .filter(l => !l.isBoundary && !l.isRecentImagery && l.analysisConfig)
        .map(l => {
          const analysisConfig = l.analysisConfig.find(
            a => a.type === routeType
          );
          const { subKey, key } = analysisConfig || {};
          const value = subKey ? data[subKey] : data[key];

          return {
            label: l.name,
            value: value || 0,
            color: l.color,
            ...l.params,
            ...l.decodeParams
          };
        })
    );
  }
);

export const getDrawAnalysisProps = createStructuredSelector({
  location: selectLocation,
  data: getDataFromLayers,
  loading: selectLoading,
  locationName: getLocationName,
  fullLocationName: getFullLocationName,
  layers: getActiveLayers
});
