import { createAction } from 'redux-actions';

const setFixedMapStatus = createAction('setFixedMapStatus');
const setMapTop = createAction('setMapTop');
const setShowMapMobile = createAction('setShowMapMobile');
const setCategory = createAction('setCategory');

export default {
  setFixedMapStatus,
  setMapTop,
  setShowMapMobile,
  setCategory
};
