import { createAction, createThunkAction } from 'redux-tools';
import axios from 'axios';
import qs from 'query-string';
import { setComponentStateToUrl } from 'utils/stateToUrl';

import { setAreasWithSubscription, deleteAreaProvider } from 'services/areas';
import {
  setArea,
  setAreas,
  viewArea,
  clearArea
} from 'providers/areas-provider/actions';

export const setSaveAOISaving = createAction('setSaveAOISaving');
export const resetSaveAOI = createAction('resetSaveAOI');

export const setSaveAOISettings = createThunkAction(
  'setSaveAOISettings',
  change => (dispatch, state) =>
    dispatch(
      setComponentStateToUrl({
        key: 'saveAOI',
        change,
        state
      })
    )
);

export const testWebhook = (data, url, callback) =>
  axios({
    method: 'POST',
    data: qs.stringify(data),
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    url
  })
    .then(response => {
      callback(response);
    })
    .catch(error => {
      let err;
      if (error.response) {
        // actual error
        err = true;
      } else err = false; // fake error
      callback(err);
    });

export const saveAOI = createThunkAction(
  'saveAOI',
  ({
    name,
    tags,
    email,
    language,
    fireAlerts,
    deforestationAlerts,
    monthlySummary,
    webhookUrl,
    activeArea,
    viewAfterSave
  }) => (dispatch, getState) => {
    const { modalSaveAOI, location, geostore } = getState();
    if (modalSaveAOI && !modalSaveAOI.saving) {
      dispatch(setSaveAOISaving({ saving: true, error: false, saved: false }));

      const { data: geostoreData } = geostore || {};
      const { id: geostoreId } = geostoreData || {};
      const { payload: { type, adm0, adm1, adm2 } } = location || {};
      const isCountry = type === 'country';
      const {
        id: activeAreaId,
        application,
        admin,
        use,
        wdpa,
        subscriptionId
      } =
        activeArea || {};
      const method = activeArea && activeArea.userArea ? 'patch' : 'post';

      const postData = {
        name,
        type,
        id: activeAreaId,
        ...(subscriptionId && {
          subscriptionId
        }),
        application: application || 'gfw',
        geostore: geostoreId,
        email,
        language,
        deforestationAlerts,
        monthlySummary,
        fireAlerts,
        admin,
        use,
        wdpa,
        ...(isCountry && {
          admin: {
            adm0,
            adm1,
            adm2
          }
        }),
        ...(type === 'use' && {
          use: {
            id: adm1,
            name: adm0
          }
        }),
        ...(type === 'wdpa' && {
          wdpaid: parseInt(adm0, 10)
        }),
        ...(webhookUrl && {
          webhookUrl
        }),
        tags: tags || [],
        public: true
      };

      setAreasWithSubscription(postData, method)
        .then(area => {
          dispatch(setArea(area));
          dispatch(
            setSaveAOISaving({ saving: false, error: false, saved: true })
          );
          if (viewAfterSave) {
            dispatch(viewArea({ areaId: area.id }));
          }
        })
        .catch(error => {
          dispatch(
            setSaveAOISaving({
              saving: false,
              saved: false,
              error: true
            })
          );
          console.info(error);
        });
    }
  }
);

export const deleteAOI = createThunkAction(
  'deleteAOI',
  ({ id, subscriptionId, clearAfterDelete }) => (dispatch, getState) => {
    const { data: areas } = getState().areas || {};
    dispatch(setSaveAOISaving({ saving: true, error: false, deleted: false }));

    deleteAreaProvider({ id, subscriptionId })
      .then(response => {
        if (
          response.status &&
          response.status >= 200 &&
          response.status < 300
        ) {
          dispatch(setAreas(areas.filter(a => a.id !== id)));
          dispatch(
            setSaveAOISaving({ saving: false, error: false, deleted: true })
          );
          if (clearAfterDelete) {
            dispatch(clearArea());
          }
        }
      })
      .catch(error => {
        dispatch(
          setSaveAOISaving({
            saving: false,
            error: true,
            deleted: false
          })
        );
        console.info(error);
      });
  }
);
