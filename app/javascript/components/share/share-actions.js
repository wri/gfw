import { createAction } from 'redux-actions';

export const setShareModal = createAction('setShareModal');
export const setShareUrl = createAction('setShareUrl');

export default {
  setShareModal,
  setShareUrl
};
