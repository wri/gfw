import { createAction, createThunkAction } from 'redux/actions';
import { getMetadata } from 'services/metadata';

export const setModalMetaData = createAction('setModalMetaData');
export const setModalMetaLoading = createAction('setModalMetaLoading');
export const setModalMetaClosing = createAction('setModalMetaClosing');
export const setModalMetaSettings = createThunkAction('setModalMetaSettings');

export const getModalMetaData = createThunkAction(
  'getModalMetaData',
  ({ metakey }) =>
    (dispatch, getState) => {
      const { modalMeta } = getState();

      if (modalMeta && !modalMeta.loading) {
        dispatch(setModalMetaLoading({ loading: true, error: false }));

        // No backend type to declare: the unified /api/metadata endpoint
        // determines whether this is a dataset/layer key or a widget key
        // itself, so callers only ever supply the bare key.
        getMetadata(metakey)
          .then((response) => {
            dispatch(setModalMetaData(response.data.metadata));
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
