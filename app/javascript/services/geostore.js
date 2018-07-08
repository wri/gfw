import request from 'utils/request';
import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API}`;
const QUERIES = {
  geostore: '/geostore',
  admin: '/v2/geostore/admin/'
};

export const getGeostoreProvider = (country, region, subRegion) => {
  const url = `${REQUEST_URL}${QUERIES.admin}${country}${
    region ? `/${region}` : ''
  }${subRegion ? `/${subRegion}` : ''}`;
  return request.get(url);
};

export const getGeostoreKey = geojson => {
  const url = REQUEST_URL + QUERIES.geostore;
  return axios({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    data: {
      geojson
    },
    url
  });
};

export default {
  getGeostoreProvider
};

/*
save: function(geojson) {
      return new Promise(function(resolve, reject) {

        var url = new UriTemplate(URL).fillFromObject({});

        ds.define(SAVE_REQUEST_ID, {
          cache: false,
          url: url,
          type: 'POST',
          dataType: 'json',
          contentType: 'application/json; charset=utf-8'
        });

        var requestConfig = {
          resourceId: SAVE_REQUEST_ID,
          data: JSON.stringify({
            geojson: geojson
          }),
          success: function(response) {
            resolve(response.data.id);
          },
          error: reject
        };

        ds.request(requestConfig);

      });
    },
*/
