import { createSelector, createStructuredSelector } from 'reselect';
import moment from 'moment';
import flatMap from 'lodash/flatMap';
import intersection from 'lodash/intersection';

import { locationLevelToStr } from 'utils/format';

import {
  getActiveLayers,
  getMapZoom,
  getActiveLayersWithDates
} from 'components/map/selectors';
import { parseWidgetsWithOptions } from 'components/widgets/selectors';
import { getWidgetLayers, getLoading } from 'components/analysis/selectors';
import {
  getGeodescriberTitle,
  getGeodescriberDescription
} from 'providers/geodescriber-provider/selectors';

const gainID = '3b22a574-2507-4b4a-a247-80057c1a1ad4';
const lossID = 'c3075c5a-5567-4b09-bc0d-96ed1673f8b6';

const selectLocation = state => state.location && state.location.payload;
const selectData = state => state.analysis && state.analysis.data;
const selectError = state => state.analysis && state.analysis.error;

export const getDataFromLayers = createSelector(
  [getActiveLayers, selectData, selectLocation, getWidgetLayers],
  (layers, data, location, widgetLayers) => {
    if (!layers || !layers.length) return null;

    const { type } = location;
    const routeType = type === 'country' ? 'admin' : type;
    const admLevel = locationLevelToStr(location);

    return layers
      .filter(
        l =>
          !l.isBoundary &&
          !l.isRecentImagery &&
          l.analysisConfig &&
          !widgetLayers.includes(l.id) &&
          (!l.admLevels || l.admLevels.includes(admLevel))
      )
      .map(l => {
        let analysisConfig = l.analysisConfig.find(a => a.type === routeType);
        if (!analysisConfig) {
          analysisConfig = l.analysisConfig.find(a => a.type === 'geostore');
        }
        const { subKey, key, keys, service, unit, dateFormat } =
          analysisConfig || {};
        const dataByService = data[service] || {};
        const value = subKey
          ? dataByService[key] && dataByService[key][subKey]
          : dataByService[key];
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
            color: k.color
          }));

        return {
          label: l.name,
          value: keysValue || value || 0,
          downloadUrls: dataByService && dataByService.downloadUrls,
          unit,
          dateFormat,
          color: l.color,
          ...params,
          ...decodeParams
        };
      });
  }
);

export const getCountryDownloadLink = createSelector(
  [selectLocation],
  location =>
    (location.type === 'country'
      ? `https://gfw2-data.s3.amazonaws.com/country-pages/country_stats/download/${location.adm0 ||
          'global'}.xlsx`
      : null)
);

export const getDownloadLinks = createSelector(
  [getDataFromLayers, getCountryDownloadLink],
  (data, countryUrl) => {
    const layerLinks =
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
      });

    return countryUrl
      ? [
        {
          label: 'National Data',
          urls: [
            {
              label: 'xlxs',
              url: countryUrl
            }
          ]
        }
      ].concat(layerLinks)
      : layerLinks;
  }
);

export const showAnalysisDisclaimer = createSelector(
  [getActiveLayers],
  layers => {
    const layersIDs = layers.map(l => l.id);
    return layersIDs.includes(gainID) && layersIDs.includes(lossID);
  }
);

// get widgets related to map layers and use them to build the layers
export const getWidgetsWithLayerParams = createSelector(
  [parseWidgetsWithOptions, getActiveLayersWithDates],
  (widgets, layers) => {
    if (!widgets || !widgets.length || !layers || !layers.length) return null;
    const layerIds = layers && layers.map(l => l.id);
    const filteredWidgets = widgets.filter(w => {
      const layerIntersection =
        w.config.datasets &&
        intersection(flatMap(w.config.datasets.map(d => d.layers)), layerIds);
      return w.config.analysis && layerIntersection && layerIntersection.length;
    });
    return filteredWidgets.map(w => {
      const widgetLayer =
        layers &&
        layers.find(
          l =>
            w.config &&
            w.config.datasets &&
            flatMap(w.config.datasets.map(d => d.layers)).includes(l.id)
        );
      const { params, decodeParams } = widgetLayer || {};
      const startDate =
        (params && params.startDate) ||
        (decodeParams && decodeParams.startDate);
      const startYear =
        startDate && parseInt(moment(startDate).format('YYYY'), 10);
      const endDate =
        (params && params.endDate) || (decodeParams && decodeParams.endDate);
      const endYear = endDate && parseInt(moment(endDate).format('YYYY'), 10);

      // fix for 2018 data not being ready. please remove once active
      const newSettings = {
        ...params,
        ...decodeParams,
        ...(startYear && {
          startYear
        }),
        ...(endYear && {
          endYear
        })
      };

      return {
        ...w,
        settings: {
          ...w.settings,
          ...newSettings,
          ...(newSettings.endYear > w.settings.endYear && {
            endYear: w.settings.endYear
          })
        }
      };
    });
  }
);

export const getShowAnalysisProps = createStructuredSelector({
  data: getDataFromLayers,
  loading: getLoading,
  layers: getActiveLayers,
  downloadUrls: getDownloadLinks,
  error: selectError,
  showAnalysisDisclaimer,
  widgets: getWidgetsWithLayerParams,
  zoomLevel: getMapZoom,
  analysisTitle: getGeodescriberTitle,
  analysisDescription: getGeodescriberDescription
});
