import axios from 'axios';
import { createThunkAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';
import { getMapZoom, getBasemap } from 'components/map-v2/selectors';
import { addToDate } from 'utils/dates';
import { getLocationFromData } from 'utils/format';
import { MAP } from 'router';

const { GFW_API } = process.env;

export const setMapSettings = createThunkAction(
  'setMapSettings',
  change => (dispatch, state) =>
    dispatch(
      setComponentStateToUrl({
        key: 'map',
        change,
        state
      })
    )
);

export const setLandsatBasemap = createThunkAction(
  'setLandsatBasemap',
  ({ year, defaultUrl }) => (dispatch, getState) => {
    const mapZoom = getMapZoom(getState());
    const currentBasemap = getBasemap(getState());
    const landsat = {
      key: `GFW__GEE_LANDSAT_BASEMAP_URL_${year}`,
      get geeUrl() {
        const item = localStorage.getItem(this.key);
        if (item) {
          const parsed = JSON.parse(item);
          return parsed.expires > Date.now() ? parsed.url : null;
        }
        return null;
      },
      set geeUrl(url) {
        const value = { url, expires: addToDate(Date.now(), 1).getTime() };
        return localStorage.setItem(this.key, JSON.stringify(value));
      },
      get url() {
        if (mapZoom > 11) {
          return this.geeUrl;
        }
        return defaultUrl && defaultUrl.replace('{year}', year);
      }
    };
    if (landsat.geeUrl === null) {
      axios.get(`${GFW_API}/v1/landsat-tiles/${year}`).then(({ data: res }) => {
        landsat.geeUrl = res.data.attributes.url;
      });
    }
    if (landsat.url !== null && landsat.url !== currentBasemap.url) {
      dispatch(
        setMapSettings({
          basemap: {
            year,
            defaultUrl,
            id: 'landsat',
            url: landsat.url,
            color: '#0C0045'
          }
        })
      );
    }
  }
);

export const setAnalysisView = createThunkAction(
  'setAnalysisView',
  ({ data, layer }) => (dispatch, getState) => {
    const { cartodb_id, wdpaid } = data || {};
    const { analysisEndpoint, tableName } = layer || {};
    const query = getState().location.query || {};

    // get location payload based on layer type
    let payload = {};
    if (data) {
      if (analysisEndpoint === 'admin') {
        payload = {
          type: 'country',
          ...getLocationFromData(data)
        };
      } else if (analysisEndpoint === 'wdpa' && (cartodb_id || wdpaid)) {
        payload = {
          type: analysisEndpoint,
          country: wdpaid || cartodb_id
        };
      } else if (cartodb_id && tableName) {
        payload = {
          type: 'use',
          country: tableName,
          region: cartodb_id
        };
      }
    }

    if (payload && payload.country) {
      dispatch({
        type: MAP,
        payload,
        query: {
          ...query,
          map: {
            ...(query && query.map && query.map),
            canBound: true
          },
          analysis: {
            ...(query && query.analysis && query.analysis),
            showAnalysis: true
          }
        }
      });
    }
  }
);
