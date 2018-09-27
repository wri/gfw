import { getGlobalLandCover } from 'services/forest-data';

export default ({ params }) =>
  getGlobalLandCover(params).then(response => {
    const data = response.data.rows;
    return data;
  });
