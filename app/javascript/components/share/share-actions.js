import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getShortenUrl } from 'services/bitly';

const setShare = createThunkAction('setShare', params => dispatch => {
  const {
    isOpen,
    haveEmbed,
    selectedType,
    data: { title, embedSettings }
  } = params;
  let { data: { url, embedUrl } } = params;

  getShortenUrl(url).then(response => {
    if (response.data.status_code === 200) {
      url = response.data.data.url;
    }

    embedUrl = `<iframe width="${embedSettings.width}" height="${
      embedSettings.height
    }" frameborder="0" src="${embedUrl || params.data.url}"></iframe>`;

    dispatch(
      setShareData({
        isOpen,
        haveEmbed,
        selectedType,
        data: {
          title,
          url,
          embedUrl,
          embedSettings
        }
      })
    );
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
