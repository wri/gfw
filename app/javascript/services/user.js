import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API}`;

export const loginUser = formData =>
  axios.post(
    `${REQUEST_URL}/auth/login?callbackUrl=https://localhost:5000`,
    formData
  );

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
    withCredentials: true
  });
};
