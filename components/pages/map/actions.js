import { createAction, createThunkAction } from 'redux/actions';
import { getLocationFromData } from 'utils/format';
import useRouter from 'utils/router';

export const setMainMapSettings = createAction('setMainMapSettings');

export const setMainMapAnalysisView = createThunkAction(
  'setMainMapAnalysisView',
  ({ data, layer }) => () => {
    const { cartodb_id, wdpaid } = data || {};
    const { analysisEndpoint, tableName } = layer || {};
    const { query, pushQuery, pathname } = useRouter();
    const { map, mainMap } = query || {};

    // get location payload based on layer type
    let payload = {};
    if (data) {
      if (analysisEndpoint === 'admin') {
        payload = {
          type: 'country',
          ...getLocationFromData(data),
        };
      } else if (analysisEndpoint === 'wdpa' && (cartodb_id || wdpaid)) {
        payload = {
          type: analysisEndpoint,
          adm0: wdpaid || cartodb_id,
        };
      } else if (cartodb_id && tableName) {
        payload = {
          type: 'use',
          adm0: tableName,
          adm1: cartodb_id,
        };
      }
    }

    if (payload && payload.adm0) {
      pushQuery({
        pathname,
        query: {
          ...query,
          location: Object.values(payload),
          map: {
            ...map,
            canBound: true,
          },
          mainMap: {
            ...mainMap,
            showAnalysis: true,
          },
        },
      });
    }
  }
);

export const setDrawnGeostore = createThunkAction(
  'setDrawnGeostore',
  (geostoreId) => () => {
    const { pushQuery, query, pathname } = useRouter();

    const { map, mainMap } = query || {};
    pushQuery({
      pathname,
      query: {
        ...query,
        location: ['geostore', geostoreId],
        map: {
          ...map,
          canBound: true,
          drawing: false,
        },
        mainMap: {
          ...mainMap,
          showAnalysis: true,
        },
      },
    });
  }
);
