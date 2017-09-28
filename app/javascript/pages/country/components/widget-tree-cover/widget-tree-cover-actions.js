import { createAction } from 'redux-actions';

const setTreeCoverValues = createAction('setTreeCoverValues');
const toggleTreeCoverSettings = createAction('toggleTreeCoverSettings');
const setLayer = createAction('setLayer');

export default {
  setTreeCoverValues,
  toggleTreeCoverSettings,
  setLayer
};
