import axios from 'axios';
import { getExtent } from 'services/forest-data';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  axios
    .all([
      getExtent(params),
      getExtent({ ...params, forestType: null, landCategory: null })
    ])
    .then(
      axios.spread((response, adminResponse) => {
        const extent = response.data && response.data.data;
        const adminExtent = adminResponse.data && adminResponse.data.data;
        let totalArea = 0;
        let totalCover = 0;
        let cover = 0;
        let plantations = 0;
        let data = {};
        if (extent.length) {
          totalArea = adminExtent[0].total_area;
          cover = extent[0].value;
          totalCover = adminExtent[0].value;
          data = {
            totalArea,
            totalCover,
            cover,
            plantations
          };
        }
        if (params.forestType || params.landCategory) {
          dispatch(setWidgetData({ data, widget }));
        } else {
          getExtent({ ...params, forestType: 'plantations' }).then(
            plantationsResponse => {
              const plantationsData =
                plantationsResponse.data && plantationsResponse.data.data;
              plantations = plantationsData.length
                ? plantationsData[0].value
                : 0;
              if (extent.length) {
                data = {
                  ...data,
                  plantations
                };
              }
              dispatch(setWidgetData({ data, widget }));
            }
          );
        }
      })
    )
    .catch(error => {
      dispatch(setWidgetData({ widget, error: true }));
      console.info(error);
    });
};

export default {
  getData
};
