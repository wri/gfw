import axios from 'axios';
import { fetchLossRanked, fetchExtentRanked } from 'services/forest-data';

export const getData = ({ params }) =>
  axios.all([fetchLossRanked(params), fetchExtentRanked(params)]).then(
    axios.spread((lossResponse, extentResponse) => {
      const { data } = lossResponse.data;
      let mappedData = [];
      if (data && data.length) {
        mappedData = data.map(item => {
          const loss = item.loss || 0;
          return {
            ...item,
            loss
          };
        });
      }
      return {
        loss: mappedData,
        extent: extentResponse.data.data
      };
    })
  );

export const getDataURL = ({ params }) => [
  fetchLossRanked({ ...params, download: true }),
  fetchExtentRanked({ ...params, download: true })
];

export default getData;
