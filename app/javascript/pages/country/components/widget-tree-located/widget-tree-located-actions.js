import { createAction } from 'redux-actions';

const setTreeLocatedValues = createAction('setTreeLocatedValues');
const setArrayLocated = createAction('setArrayLocated');

export default {
  setTreeLocatedValues,
  setArrayLocated
};
