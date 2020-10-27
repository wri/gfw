import { createAction, createThunkAction } from 'redux/actions';
import { getLocationFromData } from 'utils/format';
import compact from 'lodash/compact';

import useRouter from 'utils/router';

import { getGeostoreId } from 'providers/geostore-provider/actions';
import { setMapPromptsSettings } from 'components/prompts/map-prompts/actions';
import { setMenuSettings } from 'components/map-menu/actions';

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

export const onDrawComplete = createThunkAction(
  'handleClickAnalysis',
  (geojson) => (dispatch) => {
    dispatch(
      getGeostoreId({
        geojson,
        callback: (id) => dispatch(setDrawnGeostore(id)),
      })
    );
  }
);

export const handleClickAnalysis = createThunkAction(
  'handleClickAnalysis',
  (selected) => (dispatch) => {
    const { data, layer, geometry } = selected;
    const { cartodb_id, wdpaid } = data || {};
    const { analysisEndpoint, tableName } = layer || {};

    const isAdmin = analysisEndpoint === 'admin';
    const isWdpa = analysisEndpoint === 'wdpa' && (cartodb_id || wdpaid);
    const isUse = cartodb_id && tableName;

    if (isAdmin || isWdpa || isUse) {
      dispatch(setMainMapAnalysisView(selected));
    } else {
      dispatch(onDrawComplete(geometry));
    }
  }
);

export const handleClickMap = createThunkAction(
  'handleClickMap',
  () => (dispatch, getState) => {
    const { mapMenu, location } = getState();

    if (mapMenu?.settings?.menuSection) {
      dispatch(setMenuSettings({ menuSection: '' }));
    }

    if (location?.type) {
      dispatch(
        setMapPromptsSettings({
          open: true,
          stepsKey: 'subscribeToArea',
          stepIndex: 0,
        })
      );
    }
  }
);
