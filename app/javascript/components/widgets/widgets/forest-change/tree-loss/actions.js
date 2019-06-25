import axios from 'axios';
import { getExtent, getLoss } from 'services/forest-data';

export const getData = ({ params }) =>
  axios.all([getLoss(params), getExtent(params)]).then(
    axios.spread((loss, extent) => {
      let data = {};
      if (loss && loss.data && extent && extent.data) {
        data = {
          loss: loss.data.data,
          extent: (loss.data.data && extent.data.data[0].value) || 0
        };
      }
      return data;
    })
  );

export const getDataURL = params => [
  getLoss({ ...params, landCategory: 'tsc', download: true }),
  getExtent({ ...params, download: true })
];

export default getData;
