import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getLocations } from 'services/forest-data';

const setTreeLocatedData = createAction('setTreeLocatedData');
const setTreeLocatedPage = createAction('setTreeLocatedPage');
const setTreeLocatedSettings = createAction('setTreeLocatedSettings');
const setTreeLocatedLoading = createAction('setTreeLocatedLoading');

const getTreeLocated = createThunkAction(
  'getTreeLocated',
  params => (dispatch, state) => {
    if (!state().widgetTreeLocated.loading) {
      dispatch(setTreeLocatedLoading({ loading: true, error: false }));
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
          dispatch(setTreeLocatedData(mappedData));
        })
        .catch(error => {
          dispatch(setTreeLocatedLoading({ loading: false, error: true }));
          console.error(error);
        });
    }
  }
);

export default {
  setTreeLocatedData,
  setTreeLocatedPage,
  setTreeLocatedSettings,
  setTreeLocatedLoading,
  getTreeLocated
};
