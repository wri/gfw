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
          let mappedData = [];
          if (data && data.length) {
            mappedData = data.map(d => ({
              id: d[params.region ? 'adm2' : 'adm1'],
              area: d.value || 0,
              percentage: d.value / d.total_area * 100
            }));
          }
          dispatch(setTreeLocatedData(mappedData));
        })
        .catch(error => {
          console.info(error);
          dispatch(setTreeLocatedLoading({ loading: false, error: true }));
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
