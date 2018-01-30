import axios from 'axios';

const REQUEST_URL = `${
  process.env.CLIMATE_WATCH_API_URL
}/emissions?gas=107&location={adm0}&source=25`;

export const getEmissions = ({ country }) => {
  const url = REQUEST_URL.replace('{adm0}', country);
  return axios.get(url);
};
