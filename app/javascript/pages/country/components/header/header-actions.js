import { createAction } from 'redux-actions';

const setInitialState = createAction('setInitialState');
const setRegion = createAction('setRegion');
const setTreeCoverValuesHeader = createAction('setTreeCoverValuesHeader');

export default {
  setInitialState,
  setRegion,
  setTreeCoverValuesHeader
};
