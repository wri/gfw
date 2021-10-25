import { createAction, createThunkAction } from 'redux/actions';

import getGfwMeta from 'utils/gfw-meta';

export const setGFWMeta = createAction('setGFWMeta');
export const setGFWMetaLoading = createAction('setGFWMetaLoading');

export const fetchGfwMeta = createThunkAction(
  'fetchGfwMeta',
  () => async (dispatch) => {
    dispatch(setGFWMetaLoading({ loading: true, error: false }));
    const meta = await getGfwMeta();
    dispatch(setGFWMeta(meta));
    dispatch(
      setGFWMetaLoading({ loading: false, error: false, initialized: true })
    );
  }
);
