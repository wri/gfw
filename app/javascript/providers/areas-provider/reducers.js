import findIndex from 'lodash/findIndex';
import * as actions from './actions';

export const initialState = {
  loading: false,
  error: false,
  data: []
};

const setAreaLocation = area => {
  const { geostore, admin, use, wdpaid } = area || {};
  return {
    type: 'geostore',
    adm0: geostore,
    ...(admin &&
      admin.adm0 && {
      type: 'country',
      adm0: admin.adm0,
      adm1: admin.adm1,
      adm2: admin.adm2
    }),
    ...(use &&
      use.id && {
      type: 'use',
      adm0: use.name,
      adm1: use.id
    }),
    ...(wdpaid && {
      type: 'wdpa',
      adm0: wdpaid
    })
  };
};

const setAreas = (state, { payload }) => ({
  ...state,
  data: payload.map(area => ({
    ...area,
    location: setAreaLocation(area)
  }))
});

const setArea = (state, { payload }) => {
  const area = {
    ...payload,
    location: setAreaLocation(payload)
  };
  const { data: areas } = state;
  const index = findIndex(areas, ['id', area.id]);
  const data = [...areas];
  if (index > -1) {
    data.splice(index, 1, area); // substitution
  } else {
    data.push(area); // addition
  }
  return {
    ...state,
    data
  };
};

const setAreasLoading = (state, { payload }) => ({
  ...state,
  loading: payload.loading,
  error: payload.error
});

export default {
  [actions.setArea]: setArea,
  [actions.setAreas]: setAreas,
  [actions.setAreasLoading]: setAreasLoading
};
