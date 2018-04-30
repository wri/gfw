import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import { fetchGladIntersectionAlerts, fetchGLADLatest } from 'services/alerts';
import { getMultiRegionExtent } from 'services/forest-data';

const setGladRankedData = createAction('setGladRankedData');
const setGladRankedPage = createAction('setGladRankedPage');
const setGladRankedSettings = createAction('setGladRankedSettings');
const setGladRankedLoading = createAction('setGladRankedLoading');

const getGladRanked = createThunkAction(
  'getGladRanked',
  params => (dispatch, state) => {
    if (!state().widgetGladBiodiversity.loading) {
      dispatch(setGladRankedLoading({ loading: true, error: false }));
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
              setGladRankedData(
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
          dispatch(setGladRankedLoading({ loading: false, error: true }));
        });
    }
  }
);

export default {
  setGladRankedData,
  setGladRankedPage,
  setGladRankedSettings,
  setGladRankedLoading,
  getGladRanked
};
