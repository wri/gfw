import { createAction } from 'redux-actions';

const setShowPanel = createAction('setShowPanel');
const setShowMyGfw = createAction('setShowMyGfw');
const setLangSelector = createAction('setLangSelector');

export default {
  setShowPanel,
  setShowMyGfw,
  setLangSelector
};
