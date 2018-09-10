import axios from 'axios';
import { createThunkAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';
import { getMapZoom, getBasemap } from 'components/map-v2/selectors';
import { addToDate } from 'utils/dates';

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
  (year, defaultUrl) => (dispatch, getState) => {
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
        return defaultUrl.replace('{year}', year);
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
