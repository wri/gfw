import { getUSLandCover } from 'services/forest-data';

export const getDownloadLink = ({ params }) => getUSLandCover(params);

export default ({ params }) =>
  getUSLandCover({ ...params }).then(response => {
    const data = response.data.rows;
    return data;
  });
