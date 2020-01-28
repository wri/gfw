import { apiAuthRequest } from 'utils/request';

export const postSubscription = data =>
  apiAuthRequest({
    method: 'POST',
    data,
    url: '/subscriptions'
  });
