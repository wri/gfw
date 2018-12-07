import { createThunkAction, createAction } from 'vizzuality-redux-tools';
import axios from 'axios';

import { setComponentStateToUrl } from 'utils/stateToUrl';
import { addToDate } from 'utils/dates';

export const setMapLoading = createAction('setMapLoading');

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
  ({ basemap, year, zoom }) => dispatch => {
    const { url } = basemap;
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
      set geeUrl(newUrl) {
        const value = {
          url: newUrl,
          expires: addToDate(Date.now(), 1).getTime()
        };
        return localStorage.setItem(this.key, JSON.stringify(value));
      },
      get url() {
        if (zoom > 11) {
          return this.geeUrl;
        }
        return url && url.replace('{year}', year);
      }
    };
    if (landsat.geeUrl === null) {
      axios
        .get(`${process.env.GFW_API}/v1/landsat-tiles/${year}`)
        .then(({ data: res }) => {
          landsat.geeUrl = res.data.attributes.url;
        });
    }
    if (landsat.url !== null && landsat.url !== basemap.url) {
      dispatch(
        setMapSettings({
          basemap: {
            year,
            key: 'landsat',
            url: landsat.url
          },
          label: basemap.labelsKey
        })
      );
    }
  }
);
