import { createAction } from 'redux-actions';

const setTreeLossValues = createAction('setTreeLossValues');
const setLayer = createAction('setLayer');

export default {
  setTreeLossValues,
  setLayer
};
