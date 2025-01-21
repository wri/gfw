import { apiAuthRequest } from 'utils/request';
import { trackEvent } from 'utils/analytics';

const REQUEST_URL = '/v2/area';
const SOURCE = `?source[provider]=gadm&source[version]=3.6`;

export const getArea = (id, userToken = null) =>
  apiAuthRequest
    .get(`${REQUEST_URL}/${id}${SOURCE}`, {
      headers: {
        ...(userToken && {
          Authorization: `Bearer ${userToken}`,
        }),
      },
    })
    .then((areaResponse) => {
      const { data: area } = areaResponse.data;
      const admin = area.attributes && area.attributes.admin;
      const iso = area.attributes && area.attributes.iso;

      return {
        id: area.id,
        ...{
          ...area.attributes,
          use: {},
        },
        ...(iso &&
          iso.country && {
            admin: {
              adm0: iso.country,
              adm1: iso.region,
              adm2: iso.subregion,
              ...admin,
            },
          }),
      };
    });

export const getAreas = () =>
  apiAuthRequest.get(`${REQUEST_URL}${SOURCE}`).then((areasResponse) => {
    const { data: areas } = areasResponse.data;

    return areas.map((area) => {
      const admin = area.attributes && area.attributes.admin;
      const iso = area.attributes && area.attributes.iso;

      return {
        id: area.id,
        ...area.attributes,
        ...{
          ...area.attributes,
          use: {},
        },
        ...(iso &&
          iso.country && {
            admin: {
              adm0: iso.country,
              adm1: iso.region,
              adm2: iso.subregion,
              ...admin,
            },
          }),
        userArea: true,
      };
    });
  });

export const saveArea = (data) =>
  apiAuthRequest({
    method: data.id ? 'PATCH' : 'POST',
    url: data.id ? `${REQUEST_URL}/${data.id}` : REQUEST_URL,
    data,
  }).then((areaResponse) => {
    const { data: area } = areaResponse.data;
    trackEvent({
      category: 'User AOIs',
      action: data.id ? 'User edits aoi' : 'User saves aoi',
      label: area.id,
    });

    return {
      id: area.id,
      ...area.attributes,
      userArea: true,
    };
  });

export const deleteArea = (id) => {
  trackEvent({
    category: 'User AOIs',
    action: 'User deletes aoi',
    label: id,
  });
  return apiAuthRequest.delete(`${REQUEST_URL}/${id}`);
};
