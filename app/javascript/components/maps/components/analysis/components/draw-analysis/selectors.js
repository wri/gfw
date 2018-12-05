import { createSelector, createStructuredSelector } from 'reselect';

import { buildLocationName, buildFullLocationName } from 'utils/format';

import { getActiveLayers, getMapZoom } from 'components/maps/map/selectors';
import { getWidgetLayers } from 'components/map-v2/components/analysis/selectors';

const selectLocation = state => state.location && state.location.payload;
const selectLoading = state =>
  state.analysis.loading || state.datasets.loading || state.geostore.loading;
const selectData = state => state.analysis.data;
const selectError = state => state.analysis.error;
const selectAdmins = state => state.countryData.countries;
const selectAdmin1s = state => state.countryData.regions;
const selectAdmin2s = state => state.countryData.subRegions;
const selectGeostore = state => state.geostore.geostore;

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
  (location, adm0s, adm1s, adm2s, layers) => {
    if (location.type === 'use') {
      const analysisLayer = layers.find(l => l.tableName === location.adm0);
      return (analysisLayer && analysisLayer.name) || 'Area analysis';
    }
    if (location.type === 'geostore') return 'custom area analysis';
    if (location.type === 'wdpa') return 'protected area analysis';
    if (location.type === 'country') {
      return buildFullLocationName(location, { adm0s, adm1s, adm2s });
    }
    return 'area analysis';
  }
);

export const getDataFromLayers = createSelector(
  [
    getActiveLayers,
    selectData,
    getLocationName,
    selectLocation,
    getWidgetLayers,
    selectGeostore
  ],
  (layers, data, locationName, location, widgetLayers, geostore) => {
    if (!layers || !layers.length) return null;

    const { type } = location;
    const routeType = type === 'country' ? 'admin' : type;
    const { areaHa } = geostore;

    return [
      {
        label:
          location.type !== 'geostore'
            ? `${locationName} total area`
            : 'selected area',
        value: areaHa || 0,
        unit: 'ha'
      }
    ].concat(
      layers
        .filter(
          l =>
            !l.isBoundary &&
            !l.isRecentImagery &&
            l.analysisConfig &&
            !widgetLayers.includes(l.id)
        )
        .map(l => {
          let analysisConfig = l.analysisConfig.find(a => a.type === routeType);
          if (!analysisConfig) {
            analysisConfig = l.analysisConfig.find(a => a.type === 'geostore');
          }
          const { subKey, key, keys, service, unit } = analysisConfig || {};
          const dataByService = data[service] || {};
          const value = subKey
            ? dataByService[key] && dataByService[key][subKey]
            : dataByService[key];
          const { params, decodeParams } = l;

          const keysValue =
            keys &&
            keys.map(k => ({
              label: k.title,
              value: dataByService[k.key],
              unit: k.unit
            }));

          return {
            label: l.name,
            value: keysValue || value || 0,
            downloadUrls: dataByService && dataByService.downloadUrls,
            unit,
            color: l.color,
            ...params,
            ...decodeParams
          };
        })
    );
  }
);

export const getDownloadLinks = createSelector(
  [getDataFromLayers],
  data =>
    data &&
    data.filter(d => d.downloadUrls && d.value).map(d => {
      const { downloadUrls } = d || {};
      let downloads = [];
      if (downloadUrls) {
        Object.keys(downloadUrls).forEach(key => {
          const downloadUrlsFirstKey =
            downloadUrls && downloadUrls[key] && downloadUrls[key][0];
          if (downloadUrls[key]) {
            downloads = downloads.concat({
              url:
                downloadUrlsFirstKey === '/'
                  ? `${process.env.GFW_API}${downloadUrls[key]}`
                  : downloadUrls[key],
              label: key
            });
          }
        });
      }

      return {
        label: d.label,
        urls: downloads
      };
    })
);

export const getDrawAnalysisProps = createStructuredSelector({
  data: getDataFromLayers,
  loading: selectLoading,
  locationName: getLocationName,
  fullLocationName: getFullLocationName,
  layers: getActiveLayers,
  downloadUrls: getDownloadLinks,
  error: selectError,
  zoomLevel: getMapZoom
});
