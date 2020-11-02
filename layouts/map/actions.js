import { createAction, createThunkAction } from 'redux/actions';
import { getGadmLocationByLevel } from 'utils/gadm';
import compact from 'lodash/compact';

import useRouter from 'utils/router';

export const setMainMapSettings = createAction('setMainMapSettings');

export const setMainMapAnalysisView = createThunkAction(
  'setMainMapAnalysisView',
  ({ data, layer }) => () => {
    const { cartodb_id, wdpaid } = data || {};
    const { analysisEndpoint, tableName } = layer || {};
    const { query, pushQuery } = useRouter();
    const { map, mainMap } = query || {};

    // get location payload based on layer type
    let payload = {};
    if (data) {
      if (analysisEndpoint === 'admin') {
        payload = {
          type: 'country',
          ...getGadmLocationByLevel(data),
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
        pathname: `/map/${compact(Object.values(payload))?.join('/')}/`,
        query: {
          ...query,
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
    const { pushQuery, query } = useRouter();

    const { map, mainMap } = query || {};
    pushQuery({
      pathname: `/map/geostore/${geostoreId}/`,
      query: {
        ...query,
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
