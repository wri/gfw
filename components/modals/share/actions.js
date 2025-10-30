import { createAction, createThunkAction } from 'redux/actions';

import { getShortenUrl } from 'services/shortio';

import { saveAreaOfInterest } from 'components/forms/area-of-interest/actions';

export const setShareData = createAction('setShareData');
export const setShareUrl = createAction('setShareUrl');
export const setShareSelected = createAction('setShareSelected');
export const setShareOpen = createAction('setShareOpen');
export const setShareCopied = createAction('setShareCopied');
export const setShareLoading = createAction('setShareLoading');

export const setShareModal = createThunkAction(
  'setShareModal',
  (params) => async (dispatch) => {
    const { shareUrl } = params;

    dispatch(
      setShareData({
        ...params,
      })
    );

    try {
      getShortenUrl({
        longUrl: shareUrl,
      })
        .then((response) => {
          let shortShareUrl = '';
          if (response.status < 400) {
            shortShareUrl = response.data.shortURL;
            dispatch(setShareUrl(shortShareUrl));
          } else {
            dispatch(setShareLoading(false));
          }
        })
        .catch(() => {
          dispatch(setShareLoading(false));
        });
    } catch (error) {
      // TODO: remove this else statement and always use short.io
      // this is only for local development since bitly will always return 400 for localhost:3000
      dispatch(setShareUrl(shareUrl));
      dispatch(setShareLoading(false));
    }
  }
);

export const setShareAoi = createThunkAction(
  'shareModalSaveAoi',
  (params) => (dispatch) => {
    dispatch(saveAreaOfInterest({ ...params }));
  }
);
