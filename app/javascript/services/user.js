import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API}`;

export const loginUser = formData =>
  axios({
    method: 'POST',
    url: `${REQUEST_URL}/auth/login`,
    data: formData
  });

export const registerUser = formData =>
  axios.post(`${REQUEST_URL}/auth/sign-up`, { ...formData, apps: ['gfw'] });

export const resetPassword = formData =>
  axios.post(`${REQUEST_URL}/auth/reset-password`, formData);

export const updateUserProfile = (id, data) => {
  const url = `${process.env.GFW_API}/user/${id}`;
  return axios({
    method: 'PATCH',
    data,
    url,
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('userToken')}`
    }
  });
};

export const checkLogged = token =>
  axios.get(`${process.env.GFW_API}/user`, {
    headers: { Authorization: `Bearer ${token}` }
  });
