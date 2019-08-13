import axios from 'axios';

export const logout = () =>
  axios
    .get(`${process.env.GFW_API}/auth/logout`, { withCredentials: true })
    .then(response => {
      if (response.status < 400) {
        localStorage.removeItem('mygfw_token');
        window.location.reload();
      } else {
        console.warn('Failed to logout');
      }
    });
