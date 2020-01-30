import { all, spread } from 'axios';
import { apiAuthRequest } from 'utils/request';
import compact from 'lodash/compact';
import {
  getSubscriptions,
  getSubscription,
  saveSubscription,
  deleteSubscription
} from 'services/subscriptions';
import { subToArea, areaToSub, mergeAreasWithSubs } from 'utils/areas';

const REQUEST_URL = '/v2/area';

export const getArea = id => apiAuthRequest.get(`${REQUEST_URL}/${id}`)
  .then(areaResponse => {
    const { data: area } = areaResponse.data;

    return {
      id: area.id,
      ...area.attributes
    };
  });

export const saveArea = (data) => apiAuthRequest({
  method: data.id ? 'PATCH' : 'POST',
  url: data.id ? REQUEST_URL : REQUEST_URL.concat(`/${data.id}`),
  data
})
  .then(areaResponse => {
    const { data: area } = areaResponse.data;

    return {
      id: area.id,
      ...area.attributes,
      userArea: true
    };
  });

export const deleteArea = (id) =>
  apiAuthRequest.delete(`${REQUEST_URL}/${id}`);

export const getAreas = () => apiAuthRequest.get(REQUEST_URL)
  .then(areasResponse => {
    const { data: areas } = areasResponse.data;

    return areas.map(area => ({
      id: area.id,
      ...area.attributes,
      userArea: true
    }));
  });


export const getAreasWithSubscriptions = () =>
  all([getAreas(), getSubscriptions()])
    .then(spread((areas, subscriptions) => {
      const subsParsed = subscriptions.map(sub => subToArea(sub));
      return mergeAreasWithSubs(areas, subsParsed);
    }));

export const getAreaWithSubscription = id => {
  getArea(id)
    .then(area => {
      if (area.subscriptionId) {
        return getSubscription(id)
          .then(sub => ({
            ...subToArea(sub),
            ...area,
            areaWithSubscription: true
          }))
          .catch(() => area);
      }

      return area;
    })
    .catch(() => getSubscription(id)
      .then(sub => ({ ...subToArea(sub), subWithoutArea: true }))
      .catch(error => {
        console.error(error);
      })
    );
};


export const saveAreaWithSubscription = area => {
  const { deforestationAlerts, fireAlerts, monthlySummary, areaWithoutSubscription, subWithoutArea } = area;
  const hasSelectedSubs = deforestationAlerts || fireAlerts || monthlySummary;
  // save areaWithout sub
  // no subs chosen but has id then delete save area and delete sub
  // no sub and no chosen then just save area
  if (areaWithoutSubscription && hasSelectedSubs) {
    return saveSubscription({ ...areaToSub(area), id: null })
      .then(sub => {
        saveArea({ ...area, subscriptionId: sub.id })
          .then(newArea => ({
            ...subToArea(sub),
            ...newArea,
            areaWithSubscription: true
          }))
          .catch(() => {
            // error with saving area after saving sub
          });
      })
      .catch(() => {
        // error with saving sub
      });
  }

  if (areaWithoutSubscription && !hasSelectedSubs) {
    return saveArea(area)
      .then(newArea => ({ ...newArea, areaWithoutSubscription: true }))
      .catch(() => {
        // failed to save area
      });
  }

  if (subWithoutArea && hasSelectedSubs) {
    return all([saveSubscription(areaToSub(area)), saveArea({ ...area, subscriptionId: area.id })])
      .then(spread((sub, newArea) => ({
        ...subToArea(sub),
        ...newArea,
        areaWithSubscription: true
      })))
      .catch(() => {
        // error saving
      });
  }

  if (subWithoutArea && !hasSelectedSubs) {
    // delete subscription and save area
    return deleteSubscription(area.id)
      .then(() => {
        saveArea(area)
          .then(newArea => ({
            ...newArea,
            areaWithoutSubscription: true
          }))
          .catch(() => {
            // error with saving area after saving sub
          });
      })
      .catch(() => {
        // error with deleting subscription
      });
  }

  return false;
};

export const deleteAreaWithSubscription = () => {
  // if sub and not area, delete sub
  // if sub and area, delete both
  // if no sub id, delete area
};

// export const setAreasWithSubscription = (body = {}, method) => {
//   // if email pref post/patch subscription then save area with ID
//   const {
//     deforestationAlerts,
//     fireAlerts,
//     monthlySummary,
//     subscriptionId,
//     id
//   } = body;
//   if (
//     (deforestationAlerts || fireAlerts || monthlySummary) &&
//     subscriptionId !== id
//   ) {
//     return saveSubscription(body, subscriptionId ? 'patch' : 'post')
//       .then(subscriptionResponse => {
//         const { data: subData } = subscriptionResponse.data || {};
//         return setAreasProvider(
//           { ...body, subscriptionId: subData.id },
//           method
//         ).then(areaResponse => {
//           const { data } = areaResponse.data || {};
//           const { resource, language } = subData.attributes || {};
//           return {
//             ...data.attributes,
//             id: data.id,
//             email: resource && resource.content,
//             language,
//             subscriptionId: subData.id,
//             userArea: true
//           };
//         });
//       })
//       .catch(err => {
//         console.error(err);
//       });
//   } else if (subscriptionId) {
//     // delete subscription then update area
//     return deleteSubscription(subscriptionId)
//       .then(() =>
//         setAreasProvider(body, method).then(response => ({
//           ...response.data.data.attributes,
//           id: response.data.data.id,
//           subscriptionId: null,
//           userArea: true
//         }))
//       )
//       .catch(() =>
//         setAreasProvider(body, method).then(response => ({
//           ...response.data.data.attributes,
//           id: response.data.data.id,
//           subscriptionId: null,
//           userArea: true
//         }))
//       );
//   }

//   return setAreasProvider(body, method).then(areaData => ({
//     ...areaData.data.data.attributes,
//     id: areaData.data.data.id,
//     subscriptionId: null,
//     userArea: true
//   }));
// };

// export const deleteAreaProvider = ({ id, subscriptionId }) => {
//   if (subscriptionId && id === subscriptionId) {
//     return deleteSubscription(subscriptionId);
//   }

//   if (subscriptionId) {
//     return deleteSubscription(subscriptionId)
//       .then(() =>
//         apiAuthRequest.delete(REQUEST_URL.concat(`/${id}`), {
//           withCredentials: true
//         })
//       )
//       .catch(() =>
//         apiAuthRequest.delete(REQUEST_URL.concat(`/${id}`), {
//           withCredentials: true
//         })
//       );
//   }

//   if (id) {
//     return apiAuthRequest.delete(REQUEST_URL.concat(`/${id}`), {
//       withCredentials: true
//     });
//   }

//   return false;
// };

// export const saveSubscription = (
//   {
//     name,
//     email,
//     type,
//     admin,
//     language,
//     deforestationAlerts,
//     fireAlerts,
//     subscriptionId
//   } = {},
//   method
// ) => {
//   const isCountry = type === 'country';
//   const isUse = type === 'use';
//   const { adm0, adm1, adm2 } = admin || {};
//   const postData = {
//     id: subscriptionId,
//     name,
//     resource: {
//       type: 'EMAIL',
//       content: email
//     },
//     language,
//     datasets: compact([
//       deforestationAlerts ? 'glad-alerts' : null,
//       fireAlerts ? 'viirs-active-fires' : null,
//       deforestationAlerts ? 'umd-loss-gain' : null
//     ]),
//     params: {
//       iso: {
//         region: isCountry ? adm1 : null,
//         subRegion: isCountry ? adm2 : null,
//         country: isCountry ? adm0 : null
//       },
//       geostore: type === 'geostore' ? adm0 : null,
//       use: isUse ? adm0 : null,
//       useid: isUse ? adm1 : null,
//       wdpaid: type === 'wdpa' ? adm0 : null
//     }
//   };

//   return postSubscription(postData, method);
// };

// export default {
//   getAreasProvider
// };
