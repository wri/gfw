import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getGainLocations } from 'services/forest-data';

const setGainLocatedData = createAction('setGainLocatedData');
const setGainLocatedPage = createAction('setGainLocatedPage');
const setGainLocatedSettings = createAction('setGainLocatedSettings');
const setGainLocatedLoading = createAction('setGainLocatedLoading');

const getGainLocated = createThunkAction(
  'getGainLocated',
  params => (dispatch, state) => {
    if (!state().widgetGainLocated.loading) {
      dispatch(setGainLocatedLoading({ loading: true, error: false }));
      getGainLocations(params)
        .then(response => {
          const { data } = response.data;
          const mappedData = {};
          if (data && data.length) {
            mappedData.regions = data.map(d => ({
              id: d.region,
              gain: d.gain || 0
            }));
          }
          dispatch(setGainLocatedData(mappedData));
        })
        .catch(error => {
          dispatch(setGainLocatedLoading({ loading: false, error: true }));
          console.error(error);
        });
    }
  }
);

export default {
  setGainLocatedData,
  setGainLocatedPage,
  setGainLocatedSettings,
  setGainLocatedLoading,
  getGainLocated
};
