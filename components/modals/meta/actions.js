import { createAction, createThunkAction } from 'redux/actions';
import { getMeta } from 'services/meta';

export const setModalMetaData = createAction('setModalMetaData');
export const setModalMetaLoading = createAction('setModalMetaLoading');
export const setModalMetaClosing = createAction('setModalMetaClosing');
export const setModalMetaSettings = createThunkAction('setModalMetaSettings');

export const getModalMetaData = createThunkAction(
  'getModalMetaData',
  (metaKey) => (dispatch, getState) => {
    const { modalMeta } = getState();
    if (modalMeta && !modalMeta.loading) {
      dispatch(setModalMetaLoading({ loading: true, error: false }));
      getMeta(metaKey)
        .then((response) => {
          dispatch(setModalMetaData(response.data));
        })
        .catch(() => {
          dispatch(setModalMetaLoading({ loading: false, error: true }));
        });
    }
  }
);

export const setModalMetaClosed = createThunkAction(
  'setModalMetaClosed',
  () => (dispatch) => {
    dispatch(setModalMetaClosing(true));
    dispatch(setModalMetaSettings(''));
    setTimeout(() => {
      dispatch(setModalMetaClosing(false));
    }, 500);
  }
);
