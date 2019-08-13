import axios from 'axios';

export const updateUserProfile = (id, data) => {
  const url = `${process.env.GFW_API}/user/${id}`;
  return axios({
    method: 'PATCH',
    data,
    url,
    withCredentials: true
  });
};
