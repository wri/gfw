import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getShortenUrl } from 'services/bitly';

const setShareData = createAction('setShareData');
const setShareSelected = createAction('setShareSelected');
const setShareOpen = createAction('setShareOpen');

const setShareModal = createThunkAction('setShare', params => dispatch => {
  const { title, subtitle, embedUrl, shareUrl, embedSettings } = params;

  getShortenUrl(shareUrl).then(response => {
    let shortShareUrl = '';
    if (response.data.status_code === 200) {
      shortShareUrl = response.data.data.url;
    }
    dispatch(
      setShareData({
        title,
        subtitle,
        shareUrl: shortShareUrl,
        embedUrl,
        embedSettings
      })
    );
  });
});

export default {
  setShareModal,
  setShareData,
  setShareSelected,
  setShareOpen
};
