import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import { fetchGladIntersectionAlerts, fetchGLADLatest } from 'services/alerts';
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
          fetchGLADLatest(),
          getMultiRegionExtent({ ...params })
        ])
        .then(
          axios.spread((alerts, latest, extent) => {
            const { data } = alerts.data;
            const latestData = latest.data.data;
            const areas = extent.data.data;
            dispatch(
              setGladBiodiversityData(
                data && extent && latest
                  ? {
                    data,
                    extent: areas,
                    latest: latestData[0].attributes.date
                  }
                  : {}
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
