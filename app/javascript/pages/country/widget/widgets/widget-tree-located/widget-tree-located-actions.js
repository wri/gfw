import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getLocations } from 'services/forest-data';

const setTreeLocatedData = createAction('setTreeLocatedData');
const setTreeLocatedPage = createAction('setTreeLocatedPage');
const setTreeLocatedSettingsDataSource = createAction(
  'setTreeLocatedSettingsDataSource'
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
          setTreeLocatedData(response.data.data);
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
  setTreeLocatedSettingsDataSource,
  setTreeLocatedSettingsUnit,
  setTreeLocatedSettingsThreshold,
  setTreeLocatedIsLoading,
  getTreeLocated
};
