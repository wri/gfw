import {
  getGlobalLandCover,
  getGlobalLandCoverURL
} from 'services/forest-data';

export const getData = ({ params }) =>
  getGlobalLandCover(params).then(response => {
    const data = response.data.rows;
    return data;
  });

export const getDataURL = params => [getGlobalLandCoverURL({ ...params })];

export default getData;
