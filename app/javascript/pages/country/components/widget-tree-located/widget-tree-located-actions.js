import { createAction } from 'redux-actions';

const setTreeLocatedValues = createAction('setTreeLocatedValues');
const setArrayLocated = createAction('setArrayLocated');
const setTreeLocatedSettingsUnit = createAction('setTreeLocatedSettingsUnit');
const setTreeLocatedSettingsCanopy = createAction('setTreeLocatedSettingsCanopy');
const setTreeLocatedIsUpdating = createAction('setTreeLocatedIsUpdating');

export default {
  setTreeLocatedValues,
  setArrayLocated,
  setTreeLocatedSettingsUnit,
  setTreeLocatedSettingsCanopy,
  setTreeLocatedIsUpdating
};
