import { apiAuthRequest, apiRequest } from 'utils/request';
import { logEvent } from 'app/analytics';

const REQUEST_URL = '/v2/area';

export const getArea = (id) =>
  apiRequest.get(`${REQUEST_URL}/${id}`).then((areaResponse) => {
    const { data: area } = areaResponse.data;

    return {
      id: area.id,
      ...area.attributes,
    };
  });

export const getAreas = () =>
  apiAuthRequest.get(REQUEST_URL).then((areasResponse) => {
    const { data: areas } = areasResponse.data;

    return areas.map((area) => ({
      id: area.id,
      ...area.attributes,
      userArea: true,
    }));
  });

export const saveArea = (data) =>
  apiAuthRequest({
    method: data.id ? 'PATCH' : 'POST',
    url: data.id ? `${REQUEST_URL}/${data.id}` : REQUEST_URL,
    data,
  }).then((areaResponse) => {
    const { data: area } = areaResponse.data;
    logEvent(data.id ? 'editArea' : 'saveArea', { label: area.id });

    return {
      id: area.id,
      ...area.attributes,
      userArea: true,
    };
  });

export const deleteArea = (id) => {
  logEvent('deleteArea', { label: id });
  return apiAuthRequest.delete(`${REQUEST_URL}/${id}`);
};
