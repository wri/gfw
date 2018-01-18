import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { getExtent } from 'services/forest-data';
import axios from 'axios';

const setPrimaryTreeCoverLoading = createAction('setPrimaryTreeCoverLoading');
const setPrimaryTreeCoverData = createAction('setPrimaryTreeCoverData');
const setPrimaryTreeCoverSettings = createAction('setPrimaryTreeCoverSettings');

export const getPrimaryTreeCover = createThunkAction(
  'getPrimaryTreeCover',
  params => (dispatch, state) => {
    if (!state().widgetPrimaryTreeCover.loading) {
      const { countryWhitelist, regionWhitelist } = state().countryData;
      const { region } = state().location.payload;
      const whitelist = Object.keys(
        region ? regionWhitelist : countryWhitelist
      );
      dispatch(setPrimaryTreeCoverLoading({ loading: true, error: false }));
      axios
        .all([
          getExtent({ ...params, indicator: 'gadm28' }),
          getExtent({ ...params })
        ])
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
              dispatch(setPrimaryTreeCoverData(data));
            } else {
              let polyname = 'plantations';
              if (params.indicator === 'primary_forest__wdpa') {
                polyname = 'plantations__wdpa';
              } else if (params.indicator === 'primary_forest__mining') {
                polyname = 'plantations__mining';
              } else if (params.indicator === 'primary_forest__landmark') {
                polyname = 'plantations__landmark';
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
                  dispatch(setPrimaryTreeCoverData(data));
                }
              );
            }
          })
        )
        .catch(error => {
          dispatch(setPrimaryTreeCoverLoading({ loading: false, error: true }));
          console.info(error);
        });
    }
  }
);

export default {
  setPrimaryTreeCoverLoading,
  setPrimaryTreeCoverData,
  getPrimaryTreeCover,
  setPrimaryTreeCoverSettings
};
