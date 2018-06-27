define(['Class', 'uri', 'bluebird', 'map/services/DataService'], (
  Class,
  UriTemplate,
  Promise,
  ds
) => {
  let GET_REQUEST_ID = 'GeostoreService:get',
    SAVE_REQUEST_ID = 'GeostoreService:save';

  const URL = 'https://production-api.globalforestwatch.org' + '/geostore/{id}';

  const GeostoreService = Class.extend({
    get(id) {
      return new Promise(((resolve, reject) => {
        const url = new UriTemplate(URL).fillFromObject({ id });

        ds.define(GET_REQUEST_ID, {
          cache: false,
          url,
          type: 'GET'
        });

        const requestConfig = {
          resourceId: GET_REQUEST_ID,
          success: resolve
        };

        ds.request(requestConfig);
      }));
    },

    save(geojson) {
      return new Promise(((resolve, reject) => {
        const url = new UriTemplate(URL).fillFromObject({});

        ds.define(SAVE_REQUEST_ID, {
          cache: false,
          url,
          type: 'POST',
          dataType: 'json',
          contentType: 'application/json; charset=utf-8'
        });

        const requestConfig = {
          resourceId: SAVE_REQUEST_ID,
          data: JSON.stringify({
            geojson
          }),
          success(response) {
            resolve(response.data.id);
          },
          error: reject
        };

        ds.request(requestConfig);
      }));
    },

    use(provider) {
      return new Promise(((resolve, reject) => {
        const url = new UriTemplate(URL).fillFromObject({});

        ds.define(SAVE_REQUEST_ID, {
          cache: false,
          url,
          type: 'POST',
          dataType: 'json',
          contentType: 'application/json; charset=utf-8'
        });

        const requestConfig = {
          resourceId: SAVE_REQUEST_ID,
          data: JSON.stringify({
            provider
          }),
          success(response) {
            resolve(response.data.id);
          },
          error: reject
        };

        ds.request(requestConfig);
      }));
    }
  });

  return new GeostoreService();
});
