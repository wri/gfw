import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getShortenUrl } from 'services/bitly';

const setShareData = createAction('setShareData');
const setShareUrl = createAction('setShareUrl');
const setShareSelected = createAction('setShareSelected');
const setShareOpen = createAction('setShareOpen');
const setShareCopied = createAction('setShareCopied');
const setShareLoading = createAction('setShareLoading');

const setShareModal = createThunkAction('setShareModal', params => dispatch => {
  const { shareUrl } = params;

  dispatch(
    setShareData({
      ...params
    })
  );

  getShortenUrl(shareUrl).then(response => {
    let shortShareUrl = '';
    if (response.data.status_code === 200) {
      shortShareUrl = response.data.data.url;
      dispatch(setShareUrl(shortShareUrl));
    } else {
      dispatch(setShareLoading(false));
    }
  });
});

export default {
  setShareModal,
  setShareData,
  setShareSelected,
  setShareOpen,
  setShareUrl,
  setShareCopied,
  setShareLoading
};
