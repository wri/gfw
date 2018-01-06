import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getShortenUrl } from 'services/bitly';

const setShareData = createAction('setShareData');
const setShareSelected = createAction('setShareSelected');
const setShareOpen = createAction('setShareOpen');

const setShare = createThunkAction('setShare', params => dispatch => {
  const { open, selected, data } = params;
  const { title, subtitle, embedUrl, embedSettings } = data;

  getShortenUrl(data.shareUrl).then(response => {
    let shareUrl = '';
    if (response.data.status_code === 200) {
      shareUrl = response.data.data.url;
    }

    dispatch(
      setShareData({
        open,
        selected,
        data: {
          title,
          subtitle,
          shareUrl,
          embedUrl,
          embedSettings
        }
      })
    );
  });
});

export default {
  setShare,
  setShareData,
  setShareSelected,
  setShareOpen
};
