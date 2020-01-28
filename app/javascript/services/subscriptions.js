import { apiAuthRequest } from 'utils/request';

export const postSubscription = (data, method) =>
  apiAuthRequest({
    method,
    data: JSON.stringify(data),
    url: method === 'post' ? '/subscriptions' : `/subscriptions/${data.id}`
  });

export const getSubscriptions = () => apiAuthRequest.get('/subscriptions');

export const deleteSubscription = id =>
  apiAuthRequest.delete(`/subscriptions/${id}`);
