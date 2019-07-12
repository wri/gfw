import { getGlobalLandCover } from 'services/forest-data';

export const getData = ({ params }) =>
  getGlobalLandCover(params).then(response => {
    const data = response.data.rows;
    return data;
  });

export const getDataURL = params => [
  getGlobalLandCover({ ...params, download: true })
];

export default getData;
