import { getUSLandCover } from 'services/forest-data';

export default ({ params }) =>
  getUSLandCover({ ...params }).then(response => {
    const data = response.data.rows;
    return data;
  });
