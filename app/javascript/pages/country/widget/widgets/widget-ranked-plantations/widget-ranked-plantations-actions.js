import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import {
  getMultiRegionExtent,
  getPlantationsExtent
} from 'services/forest-data';

const setRankedPlantationsLoading = createAction('setRankedPlantationsLoading');
const setRankedPlantationsData = createAction('setRankedPlantationsData');
const setRankedPlantationsSettings = createAction(
  'setRankedPlantationsSettings'
);

const getRankedPlantations = createThunkAction(
  'getRankedPlantations',
  params => (dispatch, state) => {
    if (!state().widgetRankedPlantations.loading) {
      dispatch(setRankedPlantationsLoading({ loading: true, error: false }));
      axios
        .all([getMultiRegionExtent(params), getPlantationsExtent(params)])
        .then(
          axios.spread(
            (multiRegionExtentResponse, plantationsExtentResponse) => {
              let data = {};
              const extent =
                multiRegionExtentResponse.data &&
                multiRegionExtentResponse.data.data;
              const plantationsExtent =
                plantationsExtentResponse.data &&
                plantationsExtentResponse.data.data;
              if (extent.length && plantationsExtent.length) {
                data = {
                  extent,
                  plantations: plantationsExtent
                };
              }
              dispatch(setRankedPlantationsData(data));
            }
          )
        )
        .catch(error => {
          dispatch(
            setRankedPlantationsLoading({ loading: false, error: true })
          );
          console.info(error);
        });
    }
  }
);

export default {
  setRankedPlantationsData,
  setRankedPlantationsSettings,
  setRankedPlantationsLoading,
  getRankedPlantations
};
