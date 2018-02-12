import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API_HOST_PROD}`;
const DATASET = 'db34c2d9-77b8-43ee-b101-f499e39d1597';
const QUERY =
  'query?sql=SELECT count(*) as alerts FROM {dataset} GROUP BY julian_day, year ORDER BY year, julian_day';

export const fetchGLADDates = () => {
  const url = `${REQUEST_URL}/${QUERY}`.replace('{dataset}', DATASET);
  return axios.get(url);
};

export const fetchGLADLatest = () => {
  const url = `${REQUEST_URL}/glad-alerts/latest`;
  return axios.get(url);
};
