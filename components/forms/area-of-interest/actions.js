import { createThunkAction } from 'redux/actions';
import { FORM_ERROR } from 'final-form';

import { saveArea, deleteArea } from 'services/areas';

import {
  setArea,
  setAreas,
  viewArea,
  clearArea,
} from 'providers/areas-provider/actions';

import { getWidgetsData } from 'components/widgets/actions';

export const saveAreaOfInterest = createThunkAction(
  'saveAreaOfInterest',
  ({
    id,
    name,
    tags,
    email,
    webhookUrl,
    language,
    alerts,
    admin,
    wdpaid,
    use,
    application,
    viewAfterSave,
    publicArea,
    deforestationAlertsType,
    geostore: geostoreId,
  }) => (dispatch, getState) => {
    const { location, geostore } = getState();
    const { data: geostoreData } = geostore || {};
    const {
      payload: { type, adm0, adm1, adm2 },
    } = location || {};
    const isCountry = type === 'country';

    const postData = {
      id,
      name,
      type,
      application: application || 'gfw',
      geostore:
        type !== 'wdpa'
          ? geostoreId || (geostoreData && geostoreData.id)
          : null,
      email,
      language,
      deforestationAlerts: alerts.includes('deforestationAlerts'),
      deforestationAlertsType,
      monthlySummary: alerts.includes('monthlySummary'),
      fireAlerts: alerts.includes('fireAlerts'),
      ...(admin && {
        admin,
      }),
      ...(wdpaid && {
        wdpaid,
      }),
      ...(use && {
        use,
      }),
      ...(isCountry && {
        admin: {
          adm0,
          adm1,
          adm2,
        },
      }),
      ...(type === 'use' && {
        use: {
          id: adm1,
          name: adm0,
        },
      }),
      ...(type === 'wdpa' && {
        wdpaid: parseInt(adm0, 10),
        geostoreDataAPI: geostoreId || (geostoreData && geostoreData.id),
      }),
      ...(webhookUrl && {
        webhookUrl,
      }),
      tags: tags || [],
      public: publicArea,
      ...((isCountry || type === 'wdpa') && {
        status: 'saved',
      }),
    };

    return saveArea(postData)
      .then((area) => {
        dispatch(setArea({ ...area, userArea: true }));
        if (viewAfterSave) {
          dispatch(viewArea({ areaId: area.id }));
        }
        if (
          location.payload.type === 'geostore' ||
          location.payload.type === 'aoi'
        ) {
          dispatch(getWidgetsData());
        }
      })
      .catch((error) => {
        const { errors } = error.response.data;

        return {
          [FORM_ERROR]: errors[0].detail,
        };
      });
  }
);

export const deleteAreaOfInterest = createThunkAction(
  'deleteAreaOfInterest',
  ({ id, clearAfterDelete, callBack }) => (dispatch, getState) => {
    const { data: areas } = getState().areas || {};

    return deleteArea(id)
      .then(() => {
        dispatch(setAreas(areas.filter((a) => a.id !== id)));
        if (clearAfterDelete) {
          dispatch(clearArea());
        }
        if (callBack) {
          callBack();
        }
      })
      .catch((error) => {
        const { errors } = error.response.data;

        return {
          [FORM_ERROR]: errors[0].detail,
        };
      });
  }
);
