import { createAction } from 'redux-actions';

const setModalVideoData = createAction('setModalVideoData');
const setModalVideoClosed = createAction('setModalVideoClosed');

export default {
  setModalVideoData,
  setModalVideoClosed
};
