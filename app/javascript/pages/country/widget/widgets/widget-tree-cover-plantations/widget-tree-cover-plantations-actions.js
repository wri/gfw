import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { getExtent, getPlantationsExtent } from 'services/forest-data';
import axios from 'axios';

const setTreeCoverPlantationsLoading = createAction(
  'setTreeCoverPlantationsLoading'
);
const setTreeCoverPlantationsData = createAction('setTreeCoverPlantationsData');
const setTreeCoverPlantationsSettings = createAction(
  'setTreeCoverPlantationsSettings'
);

export const getTreeCoverPlantations = createThunkAction(
  'getTreeCoverPlantations',
  params => (dispatch, state) => {
    if (!state().widgetTreeCoverPlantations.loading) {
      dispatch(setTreeCoverPlantationsLoading({ loading: true, error: false }));
      axios
        .all([
          getExtent({ ...params, indicator: 'gadm28' }),
          getPlantationsExtent(params)
        ])
        .then(
          axios.spread((gadmResponse, plantationsResponse) => {
            const gadmExtent = gadmResponse.data && gadmResponse.data.data;
            const plantationsExtent =
              plantationsResponse.data && plantationsResponse.data.data;
            let data = {};
            if (gadmExtent.length && plantationsExtent.length) {
              const totalArea = gadmExtent[0].total_area;
              const totalExtent = gadmExtent[0].value;
              data = {
                totalArea,
                totalExtent,
                plantations: plantationsExtent
              };
            }
            dispatch(setTreeCoverPlantationsData(data));
          })
        )
        .catch(error => {
          dispatch(
            setTreeCoverPlantationsLoading({ loading: false, error: true })
          );
          console.info(error);
        });
    }
  }
);

export default {
  setTreeCoverPlantationsLoading,
  setTreeCoverPlantationsData,
  getTreeCoverPlantations,
  setTreeCoverPlantationsSettings
};
