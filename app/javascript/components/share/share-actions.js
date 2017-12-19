import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getShortenUrl } from 'services/bitly';

const setShare = createThunkAction('setShare', params => dispatch => {
  const shareData = { ...params };

  getShortenUrl(shareData.data.url).then(response => {
    if (response.data.status_code === 200) {
      shareData.data.url = response.data.data.url;
    }

    shareData.data.embedUrl = `<iframe width="${
      shareData.data.embedSettings.width
    }" height="${shareData.data.embedSettings.height}" frameborder="0" src="${
      shareData.data.embedUrl ? shareData.data.embedUrl : params.data.url
    }"></iframe>`;

    dispatch(setShareData(shareData));
  });
});
const setShareData = createAction('setShareData');
const setShareType = createAction('setShareType');
const setIsOpen = createAction('setIsOpen');

export default {
  setShare,
  setShareData,
  setShareType,
  setIsOpen
};
