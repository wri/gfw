import { createAction } from 'redux-actions';

const setTreeLocatedValues = createAction('setTreeLocatedValues');
const setTreeLocatedPage = createAction('setTreeLocatedPage');
const setTreeLocatedSettingsDataSource = createAction(
  'setTreeLocatedSettingsDataSource'
);
const setTreeLocatedSettingsUnit = createAction('setTreeLocatedSettingsUnit');
const setTreeLocatedSettingsCanopy = createAction(
  'setTreeLocatedSettingsCanopy'
);
const setTreeLocatedIsLoading = createAction('setTreeLocatedIsLoading');

export default {
  setTreeLocatedValues,
  setTreeLocatedPage,
  setTreeLocatedSettingsDataSource,
  setTreeLocatedSettingsUnit,
  setTreeLocatedSettingsCanopy,
  setTreeLocatedIsLoading
};
