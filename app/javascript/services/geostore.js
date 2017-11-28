import axios from 'axios';

const APIURL = 'https://api.resourcewatch.org/v1';

const APIURLS = {
  getAdmin: '/geostore/admin/'
};

export const getAdminGeostore = (admin0, admin1, admin2) => {
  const url = `${APIURL}${APIURLS.getAdmin}${admin0}${
    admin1 ? `/${admin1}` : ''
  }${admin2 ? `/${admin2}` : ''}`;
  return axios.get(url);
};
