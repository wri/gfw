import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getLocations } from 'services/forest-data';

const setLossLocatedData = createAction('setLossLocatedData');
const setLossLocatedPage = createAction('setLossLocatedPage');
const setLossLocatedSettings = createAction('setLossLocatedSettings');
const setLossLocatedLoading = createAction('setLossLocatedLoading');

const getLossLocated = createThunkAction(
  'getLossLocated',
  params => (dispatch, state) => {
    if (!state().widgetLossLocated.loading) {
      dispatch(setLossLocatedLoading({ loading: true, error: false }));
      getLocations(params)
        .then(response => {
          const { data } = response.data;
          const mappedData = {};
          if (data && data.length) {
            mappedData.regions = data.map(d => ({
              id: d.region,
              extent: d.extent || 0,
              percentage: d.extent ? d.extent / d.total * 100 : 0
            }));
          }
          dispatch(setLossLocatedData(mappedData));
        })
        .catch(error => {
          dispatch(setLossLocatedLoading({ loading: false, error: true }));
          console.error(error);
        });
    }
  }
);

export default {
  setLossLocatedData,
  setLossLocatedPage,
  setLossLocatedSettings,
  setLossLocatedLoading,
  getLossLocated
};
