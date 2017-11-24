import { createAction } from 'redux-actions';

export const setShareModal = createAction('setShareModal');
export const setShareUrl = createAction('setShareUrl');
export const setShareType = createAction('setShareType');

export default {
  setShareModal,
  setShareUrl,
  setShareType
};
