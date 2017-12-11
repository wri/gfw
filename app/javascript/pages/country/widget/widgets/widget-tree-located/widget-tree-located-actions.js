import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getLocations } from 'services/forest-data';

const setTreeLocatedData = createAction('setTreeLocatedData');
const setTreeLocatedPage = createAction('setTreeLocatedPage');
const setTreeLocatedSettingsIndicator = createAction(
  'setTreeLocatedSettingsIndicator'
);
const setTreeLocatedSettingsUnit = createAction('setTreeLocatedSettingsUnit');
const setTreeLocatedSettingsThreshold = createAction(
  'setTreeLocatedSettingsThreshold'
);
const setTreeLocatedIsLoading = createAction('setTreeLocatedIsLoading');

const getTreeLocated = createThunkAction(
  'getTreeLocated',
  params => (dispatch, state) => {
    if (!state().widgetTreeLocated.isLoading) {
      dispatch(setTreeLocatedIsLoading(true));
      getLocations(params)
        .then(response => {
          if (response.data.data.length) {
            dispatch(
              setTreeLocatedData(
                response.data.data.map(d => ({
                  id: d[params.region ? 'adm2' : 'adm1'],
                  area: d.value,
                  percentage: d.value / d.total_area * 100
                }))
              )
            );
          }
        })
        .catch(error => {
          console.info(error);
          dispatch(setTreeLocatedIsLoading(false));
        });
    }
  }
);

export default {
  setTreeLocatedData,
  setTreeLocatedPage,
  setTreeLocatedSettingsIndicator,
  setTreeLocatedSettingsUnit,
  setTreeLocatedSettingsThreshold,
  setTreeLocatedIsLoading,
  getTreeLocated
};
