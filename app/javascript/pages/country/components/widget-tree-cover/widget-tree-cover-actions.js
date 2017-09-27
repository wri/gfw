import { createAction } from 'redux-actions';

const setTreeCoverValues = createAction('setTreeCoverValues');
const setLayer = createAction('setLayer');

export default {
  setTreeCoverValues,
  setLayer
};
