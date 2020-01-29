import { createThunkAction } from 'utils/redux';
// import { FORM_ERROR } from 'final-form';

import {
  setArea,
  setAreas,
  viewArea,
  clearArea
} from 'providers/areas-provider/actions';
import { setAreasWithSubscription, deleteAreaProvider } from 'services/areas';

export const saveAreaOfInterest = createThunkAction(
  'saveAreaOfInterest',
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
        public: true,
        ...((isCountry || type === 'wdpa') && {
          status: 'saved'
        })
      };

      setAreasWithSubscription(postData, method)
        .then(area => {
          dispatch(setArea(area));
          if (viewAfterSave) {
            dispatch(viewArea({ areaId: area.id }));
          }
        })
        .catch(error => {
          console.info(error);
        });
    }
  }
);

export const deleteAOI = createThunkAction(
  'deleteAOI',
  ({ id, subscriptionId, clearAfterDelete }) => (dispatch, getState) => {
    const { data: areas } = getState().areas || {};

    deleteAreaProvider({ id, subscriptionId })
      .then(response => {
        if (
          response.status &&
          response.status >= 200 &&
          response.status < 300
        ) {
          dispatch(setAreas(areas.filter(a => a.id !== id)));
          if (clearAfterDelete) {
            dispatch(clearArea());
          }
        }
      })
      .catch(error => {
        console.info(error);
      });
  }
);
