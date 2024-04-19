import { createSelector, createStructuredSelector } from 'reselect';
import sumBy from 'lodash/sumBy';

import { GFW_API } from 'utils/apis';
import { locationLevelToStr } from 'utils/location';

import { getActiveLayers, getMapZoom } from 'components/map/selectors';
import { getWidgetLayers, getLoading } from 'components/analysis/selectors';
import {
  getGeodescriberTitle,
  getGeodescriberDescription,
} from 'providers/geodescriber-provider/selectors';

import { FOREST_GAIN, FOREST_LOSS } from 'data/layers';

const gainID = FOREST_GAIN;
const lossID = FOREST_LOSS;
const DOWNLOAD_VERSION = '2023';

const selectLocation = (state) => state.location && state.location.payload;
const selectData = (state) => state.analysis && state.analysis.data;
const selectError = (state) => state.analysis && state.analysis.error;

export const getDataFromLayers = createSelector(
  [getActiveLayers, selectData, selectLocation, getWidgetLayers],
  (layers, data, location, widgetLayers) => {
    if (!layers || !layers.length) return null;

    const { type } = location;
    const routeType = type === 'country' ? 'admin' : type;
    const admLevel = locationLevelToStr(location);

    return layers
      .filter(
        (l) =>
          !l.isBoundary &&
          !l.isRecentImagery &&
          l.analysisConfig &&
          (!widgetLayers || !widgetLayers.includes(l.id)) &&
          (!l.admLevels || l.admLevels.includes(admLevel))
      )
      .map((l) => {
        let analysisConfig = l.analysisConfig.find((a) => a.type === routeType);
        if (!analysisConfig) {
          analysisConfig = l.analysisConfig.find((a) => a.type === 'geostore');
        }
        const { subKey, key, keys, service, unit, dateFormat, sumByKey } =
          analysisConfig || {};
        const dataByService = data[service] || {};
        const selectedValue = subKey
          ? dataByService[key] && dataByService[key][subKey]
          : dataByService[key];
        const value =
          sumByKey && Array.isArray(selectedValue)
            ? sumBy(selectedValue, sumByKey)
            : selectedValue;
        const { params, decodeParams } = l;
        const keysValue =
          keys &&
          keys.map((k, i) => ({
            label: k.title,
            value:
              (value && value[i] && value[i][k.key]) ||
              dataByService[k.key] ||
              0,
            unit: k.unit || unit,
            color: k.color,
          }));

        return {
          label: l.name,
          value: keysValue || value || 0,
          downloadUrls: dataByService && dataByService.downloadUrls,
          unit,
          dateFormat,
          color: l.color,
          ...params,
          ...decodeParams,
        };
      });
  }
);

export const getCountryDownloadLink = createSelector(
  [selectLocation],
  (location) =>
    location.type === 'country'
      ? `https://gfw2-data.s3.amazonaws.com/country-pages/country_stats/download/${DOWNLOAD_VERSION}/${
          location.adm0 || 'global'
        }.xlsx`
      : null
);

export const getDownloadLinks = createSelector(
  [getDataFromLayers, getCountryDownloadLink],
  (data, countryUrl) => {
    // dataset-related download links
    const layerLinks =
      data &&
      data
        .filter((d) => d.downloadUrls && d.value)
        .map((d) => {
          const { downloadUrls } = d || {};
          let downloads = [];
          if (downloadUrls) {
            Object.keys(downloadUrls).forEach((key) => {
              const downloadUrlsFirstKey =
                downloadUrls && downloadUrls[key] && downloadUrls[key][0];
              if (downloadUrls[key]) {
                downloads = downloads.concat({
                  url:
                    downloadUrlsFirstKey === '/'
                      ? `${GFW_API}${downloadUrls[key]}`
                      : downloadUrls[key],
                  label: key,
                });
              }
            });
          }

          return {
            label: d.label,
            urls: downloads,
          };
        });

    // admin-related download links
    return countryUrl
      ? [
          {
            label: 'National Data',
            urls: [
              {
                label: 'xlxs',
                url: countryUrl,
              },
            ],
          },
        ].concat(layerLinks)
      : layerLinks;
  }
);

export const showAnalysisDisclaimer = createSelector(
  [getActiveLayers],
  (layers) => {
    const layersIDs = layers.map((l) => l.id);
    return layersIDs.includes(gainID) && layersIDs.includes(lossID);
  }
);

export const getShowAnalysisProps = createStructuredSelector({
  data: getDataFromLayers,
  loading: getLoading,
  layers: getActiveLayers,
  downloadUrls: getDownloadLinks,
  error: selectError,
  showAnalysisDisclaimer,
  widgetLayers: getWidgetLayers,
  zoomLevel: getMapZoom,
  analysisTitle: getGeodescriberTitle,
  analysisDescription: getGeodescriberDescription,
});
