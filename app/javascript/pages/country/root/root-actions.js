import { createAction } from 'redux-actions';

const setFixedMapStatus = createAction('setFixedMapStatus');
const setMapTop = createAction('setMapTop');
const setShowMapMobile = createAction('setShowMapMobile');

export default {
  setFixedMapStatus,
  setMapTop,
  setShowMapMobile
};
