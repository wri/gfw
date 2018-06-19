import { getExtent } from 'services/forest-data';
import axios from 'axios';

export const getData = ({ params, dispatch, setWidgetData, widget, state }) => {
  const { countryWhitelist, regionWhitelist } = state().whitelists;
  const { region } = state().location.payload;
  const whitelist = region ? regionWhitelist : countryWhitelist;
  axios
    .all([getExtent({ ...params, forestType: '' }), getExtent({ ...params })])
    .then(
      axios.spread((gadm28Response, iflResponse) => {
        const gadmExtent = gadm28Response.data && gadm28Response.data.data;
        const primaryExtent = iflResponse.data && iflResponse.data.data;
        let totalArea = 0;
        let totalExtent = 0;
        let extent = 0;
        let plantations = 0;
        let data = {};
        if (primaryExtent.length && gadmExtent.length) {
          totalArea = gadmExtent[0].total_area;
          totalExtent = gadmExtent[0].value;
          extent = primaryExtent[0].value;
          data = {
            totalArea,
            totalExtent,
            extent,
            plantations
          };
        }
        if (whitelist.indexOf('plantations') === -1) {
          dispatch(setWidgetData({ data, widget }));
        } else {
          let polyname = 'plantations';
          switch (params.indicator) {
            case 'primary_forest__wdpa':
              polyname = 'plantations__wdpa';
              break;
            case 'primary_forest__mining':
              polyname = 'plantations__mining';
              break;
            case 'primary_forest__landmark':
              polyname = 'plantations__landmark';
              break;
            default:
              break;
          }
          getExtent({ ...params, indicator: polyname }).then(
            plantationsResponse => {
              const plantationsData =
                plantationsResponse.data && plantationsResponse.data.data;
              plantations = plantationsData.length
                ? plantationsData[0].value
                : 0;
              if (primaryExtent.length && gadmExtent.length) {
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
