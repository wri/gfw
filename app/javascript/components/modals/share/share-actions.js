import { createAction, createThunkAction } from 'vizzuality-redux-tools';

import { getShortenUrl } from 'services/bitly';

export const setShareData = createAction('setShareData');
export const setShareUrl = createAction('setShareUrl');
export const setShareSelected = createAction('setShareSelected');
export const setShareOpen = createAction('setShareOpen');
export const setShareCopied = createAction('setShareCopied');
export const setShareLoading = createAction('setShareLoading');

export const setShareModal = createThunkAction(
  'setShareModal',
  params => dispatch => {
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
  }
);
