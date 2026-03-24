import { apiRequest, apiAuthRequest } from 'utils/request';

const isServer = typeof window === 'undefined';

const CALLBACK_URL = 'https://www.globalforestwatch.org/my-gfw/';

export function setServerCookie(token) {
  fetch('/api/set-cookie', { method: 'POST', body: JSON.stringify({ token }) });
}

export function removeServerCookie() {
  fetch('/api/set-cookie', { method: 'GET' });
}

export const setUserToken = (token) => {
  if (!isServer) {
    let serializedToken = token;
    // XXX: FB/Google token hack
    if (token?.endsWith('#')) {
      serializedToken = token.replace(/#$/, '');
    }

    const expirationDate = new Date();
    expirationDate.setUTCFullYear(expirationDate.getFullYear() + 1);

    localStorage.setItem('userToken', serializedToken);
    localStorage.setItem(
      'userTokenExpirationDate',
      expirationDate.toISOString()
    ); // 1 year

    apiAuthRequest.defaults.headers.Authorization = `Bearer ${serializedToken}`;
  }
};

export const login = (formData) =>
  apiRequest({
    method: 'POST',
    url: '/auth/login',
    data: formData,
  }).then((response) => {
    if (response.status < 400 && response.data) {
      const { data: userData } = response.data;
      setUserToken(userData.token);
      setServerCookie(userData.token);
    }
    return response;
  });

export const register = (formData) =>
  apiRequest.post(`/auth/sign-up?callbackUrl=${CALLBACK_URL}`, {
    ...formData,
    apps: ['gfw'],
  });

export const resetPassword = (formData) =>
  apiRequest.post(`/auth/reset-password?callbackUrl=${CALLBACK_URL}`, formData);

export const createProfile = (id, data) =>
  apiAuthRequest({
    method: 'POST',
    data,
    url: `/v2/user`,
  });

export const updateProfile = (id, data) =>
  apiAuthRequest({
    method: 'PATCH',
    data,
    url: `/v2/user/${id}`,
  });

export const checkLoggedIn = (token) => {
  if (
    token &&
    apiAuthRequest.defaults.headers.Authorization === 'Bearer {token}'
  ) {
    setUserToken(token);
  }

  return apiAuthRequest.get('/auth/check-logged');
};

export const getProfile = (id) => apiAuthRequest.get(`/v2/user/${id}`);

export const logout = () =>
  apiAuthRequest.get('/auth/logout').then((response) => {
    if (response.status < 400 && !isServer) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userTokenExpirationDate');
      removeServerCookie();
      window.location.reload();
    }
  });
