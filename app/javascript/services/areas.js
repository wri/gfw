import { all, spread } from 'axios';
import { apiRequest } from 'utils/request';
import compact from 'lodash/compact';
import {
  postSubscription,
  getSubscriptions,
  deleteSubscription
} from 'services/subscriptions';

const REQUEST_URL = '/v2/area';

export const getAreasProvider = () =>
  all([
    apiRequest.get(REQUEST_URL, {
      withCredentials: true
    }),
    getSubscriptions()
  ]).then(
    spread((areasResponse, subscriptionsResponse) => {
      const { data: areas } = areasResponse.data || {};
      const { data: subs } = subscriptionsResponse.data || {};

      const subsParsed = subs.map(sub => {
        const { id, attributes } = sub;
        const {
          datasets,
          language,
          name,
          resource,
          params: { geostore, iso, use, useid, wdpaid },
          application,
          userId,
          createdAt,
          confirmed
        } = attributes;
        const deforestationAlerts =
          datasets.includes('umd-loss-gain') ||
          datasets.includes('glad-alerts');
        const fireAlerts = datasets.includes('viirs-active-fires');

        return {
          id,
          name,
          language,
          email: resource && resource.content,
          subscriptionId: id,
          application: application || 'gfw',
          status: 'pending',
          public: true,
          userId,
          deforestationAlerts,
          fireAlerts,
          monthlySummary: false,
          geostore,
          ...(iso &&
            iso.country && {
            admin: {
              adm0: iso && iso.country,
              adm1: iso && iso.region,
              adm2: iso && iso.subRegion
            }
          }),
          ...(use &&
            useid && {
            use: {
              id: useid,
              name: use
            }
          }),
          ...(wdpaid && {
            wdpaid
          }),
          userArea: true,
          createdAt,
          confirmed
        };
      });

      const areasWithSubs = areas.map(area => {
        const sub = subsParsed.find(
          s => s.subscriptionId === area.attributes.subscriptionId
        );

        return {
          ...sub,
          ...area.attributes,
          id: area.id,
          userArea: true
        };
      });

      const areaSubIds = areasWithSubs
        .filter(a => a.subscriptionId)
        .map(a => a.subscriptionId);
      const subsWithoutAreas = subsParsed.filter(
        s => !areaSubIds.includes(s.id)
      );

      return [...areasWithSubs, ...subsWithoutAreas];
    })
  );

export const getAreaProvider = id =>
  apiRequest
    .get(`${REQUEST_URL}/${id}`, {
      withCredentials: true
    })
    .then(area => {
      const { data: areaData } = area.data;

      return {
        id: areaData.id,
        ...areaData.attributes
      };
    });

export const setAreasProvider = (data, method) => {
  const url =
    method === 'post' ? REQUEST_URL : REQUEST_URL.concat(`/${data.id}`);

  return apiRequest({
    method,
    url,
    data,
    withCredentials: true
  });
};

export const setAreasWithSubscription = (body = {}, method) => {
  // if email pref post/patch subscription then save area with ID
  const {
    deforestationAlerts,
    fireAlerts,
    monthlySummary,
    subscriptionId,
    id
  } = body;
  if (
    (deforestationAlerts || fireAlerts || monthlySummary) &&
    subscriptionId !== id
  ) {
    return saveSubscription(body, subscriptionId ? 'patch' : 'post')
      .then(subscriptionResponse => {
        const { data: subData } = subscriptionResponse.data || {};
        return setAreasProvider(
          { ...body, subscriptionId: subData.id },
          method
        ).then(areaResponse => {
          const { data } = areaResponse.data || {};
          const { resource, language } = subData.attributes || {};
          return {
            ...data.attributes,
            id: data.id,
            email: resource && resource.content,
            language,
            subscriptionId: subData.id,
            userArea: true
          };
        });
      })
      .catch(err => {
        console.error(err);
      });
  } else if (subscriptionId) {
    // delete subscription then update area
    return deleteSubscription(subscriptionId)
      .then(() =>
        setAreasProvider(body, method).then(response => ({
          ...response.data.data.attributes,
          id: response.data.data.id,
          subscriptionId: null,
          userArea: true
        }))
      )
      .catch(() =>
        setAreasProvider(body, method).then(response => ({
          ...response.data.data.attributes,
          id: response.data.data.id,
          subscriptionId: null,
          userArea: true
        }))
      );
  }

  return setAreasProvider(body, method).then(areaData => ({
    ...areaData.data.data.attributes,
    id: areaData.data.data.id,
    subscriptionId: null,
    userArea: true
  }));
};

export const deleteAreaProvider = ({ id, subscriptionId }) => {
  if (subscriptionId && id === subscriptionId) {
    return deleteSubscription(subscriptionId);
  }

  if (subscriptionId) {
    return deleteSubscription(subscriptionId)
      .then(() =>
        apiRequest.delete(REQUEST_URL.concat(`/${id}`), {
          withCredentials: true
        })
      )
      .catch(() =>
        apiRequest.delete(REQUEST_URL.concat(`/${id}`), {
          withCredentials: true
        })
      );
  }

  if (id) {
    return apiRequest.delete(REQUEST_URL.concat(`/${id}`), {
      withCredentials: true
    });
  }

  return false;
};

export const saveSubscription = (
  {
    name,
    email,
    type,
    admin,
    language,
    deforestationAlerts,
    fireAlerts,
    subscriptionId
  } = {},
  method
) => {
  const isCountry = type === 'country';
  const isUse = type === 'use';
  const { adm0, adm1, adm2 } = admin || {};
  const postData = {
    id: subscriptionId,
    name,
    resource: {
      type: 'EMAIL',
      content: email
    },
    language,
    datasets: compact([
      deforestationAlerts ? 'glad-alerts' : null,
      fireAlerts ? 'viirs-active-fires' : null,
      deforestationAlerts ? 'umd-loss-gain' : null
    ]),
    params: {
      iso: {
        region: isCountry ? adm1 : null,
        subRegion: isCountry ? adm2 : null,
        country: isCountry ? adm0 : null
      },
      geostore: type === 'geostore' ? adm0 : null,
      use: isUse ? adm0 : null,
      useid: isUse ? adm1 : null,
      wdpaid: type === 'wdpa' ? adm0 : null
    }
  };

  return postSubscription(postData, method);
};

export default {
  getAreasProvider
};
