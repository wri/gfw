import { createAction, createThunkAction } from 'redux-tools';
import { getMeta } from 'services/meta';

export const setModalMetaData = createAction('setModalMetaData');
export const setModalMetaLoading = createAction('setModalMetaLoading');
export const setModalMetaClosing = createAction('setModalMetaClosing');

export const setModalMeta = createThunkAction(
  'setModalMeta',
  (metaKey, metaWhitelist, tableWhitelist, customCitation) => (
    dispatch,
    getState
  ) => {
    const { modalMeta } = getState();
    if (modalMeta && !modalMeta.loading) {
      dispatch(
        setModalMetaLoading({ loading: true, error: false, open: true })
      );
      getMeta(metaKey)
        .then(response => {
          let data = {};
          if (response && response.data && typeof response.data !== 'string') {
            data = {
              ...response.data,
              citation: customCitation || response.data.citation
            };
          }
          dispatch(
            setModalMetaData({ ...data, metaWhitelist, tableWhitelist })
          );
        })
        .catch(error => {
          console.info(error);
          dispatch(setModalMetaLoading({ loading: false, error: true }));
        });
    }
  }
);

export const setModalMetaClosed = createThunkAction(
  'setModalMetaClosed',
  () => dispatch => {
    dispatch(
      setModalMetaClosing({ loading: false, open: false, closing: true })
    );
    setTimeout(() => {
      dispatch(setModalMetaClosing({ closing: false }));
    }, 500);
  }
);
