import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';
import moment from 'moment';

import { fetchGladIntersectionAlerts } from 'services/alerts';
import { getMultiRegionExtent } from 'services/forest-data';

const setGladRankedData = createAction('setGladRankedData');
const setGladRankedPage = createAction('setGladRankedPage');
const setGladRankedSettings = createAction('setGladRankedSettings');
const setGladRankedLoading = createAction('setGladRankedLoading');

const getGladRanked = createThunkAction(
  'getGladRanked',
  params => (dispatch, state) => {
    if (!state().widgetGladRanked.loading) {
      dispatch(setGladRankedLoading({ loading: true, error: false }));
      axios
        .all([
          fetchGladIntersectionAlerts({ ...params }),
          getMultiRegionExtent({ ...params })
        ])
        .then(
          axios.spread((alerts, extent) => {
            const { data } = alerts.data;
            const areas = extent.data.data;
            const alertsByDate =
              data &&
              data.filter(d =>
                moment(new Date(d.date)).isAfter(
                  moment.utc().subtract(53, 'weeks')
                )
              );
            dispatch(
              setGladRankedData(
                alertsByDate && extent
                  ? { data: alertsByDate, extent: areas }
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
