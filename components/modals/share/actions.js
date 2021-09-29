import { createAction, createThunkAction } from 'redux/actions';

import { getShortenUrl } from 'services/bitly';

import { saveAreaOfInterest } from 'components/forms/area-of-interest/actions';

export const setShareData = createAction('setShareData');
export const setShareUrl = createAction('setShareUrl');
export const setShareSelected = createAction('setShareSelected');
export const setShareOpen = createAction('setShareOpen');
export const setShareCopied = createAction('setShareCopied');
export const setShareLoading = createAction('setShareLoading');

export const setShareModal = createThunkAction(
  'setShareModal',
  (params) => (dispatch) => {
    const { shareUrl } = params;

    dispatch(
      setShareData({
        ...params,
      })
    );

    getShortenUrl(shareUrl)
      .then((response) => {
        let shortShareUrl = '';
        if (response.status < 400) {
          shortShareUrl = response.data.link;
          dispatch(setShareUrl(shortShareUrl));
        } else {
          dispatch(setShareLoading(false));
        }
      })
      .catch(() => {
        dispatch(setShareLoading(false));
      });
  }
);

export const setShareAoi = createThunkAction('shareModalSaveAoi', (params) => (dispatch) => {
  dispatch(saveAreaOfInterest({ ...params }))
});
