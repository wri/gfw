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
      dispatch(setTreeLocatedLoading(true));
      getLocations(params)
        .then(response => {
          if (response.data.data.length) {
            dispatch(
              setTreeLocatedData(
                response.data.data.map(d => ({
                  id: d[params.region ? 'adm2' : 'adm1'],
                  area: d.value || 0,
                  percentage: d.value / d.total_area * 100
                }))
              )
            );
          }
        })
        .catch(error => {
          console.info(error);
          dispatch(setTreeLocatedLoading(false));
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
