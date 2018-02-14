import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { getExtent } from 'services/forest-data';
import axios from 'axios';

const setIntactTreeCoverLoading = createAction('setIntactTreeCoverLoading');
const setIntactTreeCoverData = createAction('setIntactTreeCoverData');
const setIntactTreeCoverSettings = createAction('setIntactTreeCoverSettings');

const hardCodedPlantations = ['BRA', 'IDN', 'PER', 'LBR', 'COL', 'MYS', 'KHM'];

export const getIntactTreeCover = createThunkAction(
  'getIntactTreeCover',
  params => (dispatch, state) => {
    if (!state().widgetIntactTreeCover.loading) {
      const { countryWhitelist, regionWhitelist } = state().whitelists;
      const { region } = state().location.payload;
      const whitelist = Object.keys(
        region ? regionWhitelist : countryWhitelist
      );
      dispatch(setIntactTreeCoverLoading({ loading: true, error: false }));
      axios
        .all([
          getExtent({ ...params, indicator: 'gadm28' }),
          getExtent({ ...params })
        ])
        .then(
          axios.spread((gadm28Response, iflResponse) => {
            const gadmExtent = gadm28Response.data && gadm28Response.data.data;
            const iflExtent = iflResponse.data && iflResponse.data.data;
            let totalArea = 0;
            let totalExtent = 0;
            let extent = 0;
            let plantations = 0;
            let data = {};
            if (iflExtent.length && gadmExtent.length) {
              totalArea = gadmExtent[0].total_area;
              totalExtent = gadmExtent[0].value;
              extent = iflExtent[0].value;
              data = {
                totalArea,
                totalExtent,
                extent,
                plantations
              };
            }
            if (
              whitelist.indexOf('plantations') === -1 &&
              !hardCodedPlantations.includes(params.country)
            ) {
              dispatch(setIntactTreeCoverData(data));
            } else {
              let polyname = 'plantations';
              switch (params.indicator) {
                case 'ifl_2013__wdpa':
                  polyname = 'plantations__wdpa';
                  break;
                case 'ifl_2013__mining':
                  polyname = 'plantations__mining';
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
                  if (iflExtent.length && gadmExtent.length) {
                    data = {
                      ...data,
                      plantations
                    };
                  }
                  dispatch(setIntactTreeCoverData(data));
                }
              );
            }
          })
        )
        .catch(error => {
          dispatch(setIntactTreeCoverLoading({ loading: false, error: true }));
          console.info(error);
        });
    }
  }
);

export default {
  setIntactTreeCoverLoading,
  setIntactTreeCoverData,
  getIntactTreeCover,
  setIntactTreeCoverSettings
};
