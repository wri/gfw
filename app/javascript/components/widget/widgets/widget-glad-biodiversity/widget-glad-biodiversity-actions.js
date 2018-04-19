import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import { fetchGladIntersectionAlerts } from 'services/alerts';
import { getMultiRegionExtent } from 'services/forest-data';

const setGladBiodiversityData = createAction('setGladBiodiversityData');
const setGladBiodiversityPage = createAction('setGladBiodiversityPage');
const setGladBiodiversitySettings = createAction('setGladBiodiversitySettings');
const setGladBiodiversityLoading = createAction('setGladBiodiversityLoading');

const getGladBiodiversity = createThunkAction(
  'getGladBiodiversity',
  params => (dispatch, state) => {
    if (!state().widgetGladBiodiversity.loading) {
      dispatch(setGladBiodiversityLoading({ loading: true, error: false }));
      axios
        .all([
          fetchGladIntersectionAlerts({ ...params }),
          getMultiRegionExtent({ ...params })
        ])
        .then(
          axios.spread((alerts, extent) => {
            const { data } = alerts.data;
            const areas = extent.data.data;
            dispatch(
              setGladBiodiversityData(
                data && extent ? { data, extent: areas } : {}
              )
            );
          })
        )
        .catch(error => {
          console.info(error);
          dispatch(setGladBiodiversityLoading({ loading: false, error: true }));
        });
    }
  }
);

export default {
  setGladBiodiversityData,
  setGladBiodiversityPage,
  setGladBiodiversitySettings,
  setGladBiodiversityLoading,
  getGladBiodiversity
};
