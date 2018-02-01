import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { getMeta } from 'services/meta';

const setModalMetaData = createAction('setModalMetaData');
const setModalMetaLoading = createAction('setModalMetaLoading');
const setModalMetaClosing = createAction('setModalMetaClosing');

const setModalMeta = createThunkAction(
  'setModalMeta',
  (metaKey, metaWhitelist, tableWhitelist, customCitation) => (
    dispatch,
    state
  ) => {
    if (!state().modalMeta.loading) {
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

const setModalMetaClosed = createThunkAction(
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

export default {
  setModalMeta,
  setModalMetaData,
  setModalMetaClosed,
  setModalMetaLoading,
  setModalMetaClosing
};
