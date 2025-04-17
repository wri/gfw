import { apiAuthRequest } from 'utils/request';
import { trackEvent } from 'utils/analytics';

const REQUEST_URL = '/v2/area';

const parseArea = (area) => {
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
};

export const getArea = async (id, userToken = null) => {
  const getRequest = async (version) => {
    const response = await apiAuthRequest.get(
      `${REQUEST_URL}/${id}?source[provider]=gadm&source[version]=${version}`,
      {
        headers: {
          ...(userToken && {
            Authorization: `Bearer ${userToken}`,
          }),
        },
      }
    );
    const { data } = response.data;
    return data;
  };

  let gadmArea = await getRequest('4.1');

  const isEmpty =
    !gadmArea || (Array.isArray(gadmArea) && gadmArea.length === 0);

  if (isEmpty) {
    gadmArea = await getRequest('3.6');
  }

  return parseArea(gadmArea);
};

export const getAreas = () => {
  const gadm36 = apiAuthRequest
    .get(`${REQUEST_URL}?source[provider]=gadm&source[version]=3.6`)
    .then((areasResponse) => {
      const { data: areas } = areasResponse.data;

      return areas.map((area) => parseArea(area));
    });

  const gadm41 = apiAuthRequest
    .get(`${REQUEST_URL}?source[provider]=gadm&source[version]=4.1`)
    .then((areasResponse) => {
      const { data: areas } = areasResponse.data;

      return areas.map((area) => parseArea(area));
    });

  return Promise.all([gadm36, gadm41]).then(([areas36, areas41]) => {
    // logic to return only unique values, preferring 4.1 over 3.6
    const areasMap = new Map();

    areas36.map((area) => areasMap.set(area.id, area));
    areas41.map((area) => areasMap.set(area.id, area));

    return Array.from(areasMap.values());
  });
};

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
