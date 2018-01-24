import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import groupBy from 'lodash/groupBy';

import { getLocationsLoss } from 'services/forest-data';

const setLossLocatedData = createAction('setLossLocatedData');
const setLossLocatedPage = createAction('setLossLocatedPage');
const setLossLocatedSettings = createAction('setLossLocatedSettings');
const setLossLocatedLoading = createAction('setLossLocatedLoading');

const getLossLocated = createThunkAction(
  'getLossLocated',
  params => (dispatch, state) => {
    if (!state().widgetLossLocated.loading) {
      dispatch(setLossLocatedLoading({ loading: true, error: false }));
      getLocationsLoss(params)
        .then(response => {
          const { data } = response.data;
          const mappedData = {};
          if (data && data.length) {
            const lossByRegion = groupBy(data, 'region');
            mappedData.regions = Object.keys(lossByRegion).map(d => {
              const regionLoss = lossByRegion[d];
              return {
                id: parseInt(d, 10),
                loss: regionLoss
              };
            });
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
