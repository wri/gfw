import { getUSLandCover } from 'services/forest-data';

export const getDownloadLink = ({ params }) => getUSLandCover(params);

export const getData = ({ params }) =>
  getUSLandCover({ ...params }).then(response => {
    const data = response.data.rows;
    return data;
  });

export const getDataURL = params => [
  getUSLandCover({ ...params, download: true })
];

export default getData;
