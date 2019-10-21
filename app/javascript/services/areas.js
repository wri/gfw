import axios from 'axios';
import compact from 'lodash/compact';
import {
  postSubscription,
  getSubscriptions,
  deleteSubscription
} from 'services/subscriptions';

const REQUEST_URL = `${process.env.GFW_API}/v2/area`;

export const getAreasProvider = () =>
  axios
    .all([
      axios.get(REQUEST_URL, {
        withCredentials: true
      }),
      getSubscriptions()
    ])
    .then(
      axios.spread((areasResponse, subscriptionsResponse) => {
        const { data: areas } = areasResponse.data || {};
        const { data: subs } = subscriptionsResponse.data || {};

        return areas.map(area => {
          const sub = subs.find(s => s.id === area.attributes.subscriptionId);
          const { resource, language } = (sub && sub.attributes) || {};

          return {
            id: area.id,
            ...area.attributes,
            userArea: true,
            email: resource && resource.content,
            lang: language
          };
        });
      })
    );

export const getAreaProvider = id =>
  axios
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

export const setAreasProvider = (body, method) => {
  const url =
    method === 'post' ? REQUEST_URL : REQUEST_URL.concat(`/${body.id}`);

  return axios({
    method,
    url,
    data: body,
    withCredentials: true
  });
};

export const setAreasWithSubscription = (body = {}, method) => {
  // if email pref post/patch subscription then save area with ID
  const {
    deforestationAlerts,
    fireAlerts,
    monthlySummary,
    subscriptionId
  } = body;

  if (deforestationAlerts || fireAlerts || monthlySummary) {
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
            lang: language,
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
      .catch(err => {
        console.error(err);
      });
  }

  return setAreasProvider(body, method).then(areaData => ({
    ...areaData.data.data.attributes,
    id: areaData.data.data.id,
    subscriptionId: null,
    userArea: true
  }));
};

export const deleteAreaProvider = ({ id, subscriptionId }) => {
  if (subscriptionId) {
    return deleteSubscription(subscriptionId).then(() => {
      axios.delete(REQUEST_URL.concat(`/${id}`), {
        withCredentials: true
      });
    });
  }

  return axios.delete(REQUEST_URL.concat(`/${id}`), {
    withCredentials: true
  });
};

export const saveSubscription = (
  {
    name,
    email,
    type,
    admin,
    lang,
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
    language: lang,
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
