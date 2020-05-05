import { apiAuthRequest, apiRequest } from 'utils/request';
import { track } from 'app/analytics';

const REQUEST_URL = '/v2/area';

export const getArea = id =>
  apiRequest.get(`${REQUEST_URL}/${id}`).then(areaResponse => {
    const { data: area } = areaResponse.data;
    const admin = area.attributes && area.attributes.admin;
    const iso = area.attributes && area.attributes.iso;

    return {
      id: area.id,
      ...area.attributes,
      ...iso && iso.country && {
        admin: {
          adm0: iso.country,
          adm1: iso.region,
          adm2: iso.subregion,
          ...admin
        }
      }
    };
  });

export const getAreas = () =>
  apiAuthRequest.get(REQUEST_URL).then(areasResponse => {
    const { data: areas } = areasResponse.data;

    return areas.map(area => {
      const admin = area.attributes && area.attributes.admin;
      const iso = area.attributes && area.attributes.iso;

      return {
        id: area.id,
        ...area.attributes,
        ...iso && iso.country && {
          admin: {
            adm0: iso.country,
            adm1: iso.region,
            adm2: iso.subregion,
            ...admin
          }
        },
        userArea: true
      };
    });
  });

export const saveArea = data =>
  apiAuthRequest({
    method: data.id ? 'PATCH' : 'POST',
    url: data.id ? `${REQUEST_URL}/${data.id}` : REQUEST_URL,
    data
  }).then(areaResponse => {
    const { data: area } = areaResponse.data;
    track(data.id ? 'editArea' : 'saveArea', { label: area.id });

    return {
      id: area.id,
      ...area.attributes,
      userArea: true
    };
  });

export const deleteArea = id => {
  track('deleteArea', { label: id });
  return apiAuthRequest.delete(`${REQUEST_URL}/${id}`);
};
