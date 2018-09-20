import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import { buildLocationName, buildFullLocationName } from 'utils/format';

import { getActiveLayers } from 'components/map-v2/selectors';

const selectLocation = state => state.location && state.location.payload;
const selectLoading = state =>
  state.analysis.loading || state.datasets.loading || state.geostore.loading;
const selectData = state => state.analysis.data;
const selectError = state => state.analysis.error;
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
  [selectLocation, selectAdmins, selectAdmin1s, selectAdmin2s, getActiveLayers],
  (location, adms, adm1s, adm2s, layers) => {
    if (location.type === 'use') {
      const analysisLayer = layers.find(l => l.tableName === location.country);
      return (analysisLayer && analysisLayer.name) || 'Area analysis';
    }
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
    if (!layers || !layers.length || isEmpty(data)) return null;
    const { type } = location;
    const routeType = type === 'country' ? 'admin' : type;
    const area = data[Object.keys(data)[0]].areaHa;
    return [
      {
        label:
          location.type !== 'geostore'
            ? `${locationName} total area`
            : 'selected area',
        value: area || 0,
        unit: 'ha'
      }
    ].concat(
      layers
        .filter(l => !l.isBoundary && !l.isRecentImagery && l.analysisConfig)
        .map(l => {
          let analysisConfig = l.analysisConfig.find(a => a.type === routeType);
          if (!analysisConfig) {
            analysisConfig = l.analysisConfig.find(a => a.type === 'geostore');
          }

          const { subKey, key, service, unit } = analysisConfig || {};
          const dataByService = data[service] || {};
          let value = dataByService[key] || dataByService[subKey];
          const { params, decodeParams } = l;

          value =
            Array.isArray(value) && !!value.length
              ? value.map(v => ({
                label: analysisConfig[v[analysisConfig.subKey]],
                value: v[key]
              }))
              : value;

          return {
            label: l.name,
            value: value || 0,
            unit,
            color: l.color,
            ...params,
            ...decodeParams
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
  layers: getActiveLayers,
  error: selectError
});
