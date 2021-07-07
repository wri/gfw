import { createAction, createThunkAction } from 'redux/actions';
import moment from 'moment';

import { fetchGLADLatest, fetchVIIRSLatest } from 'services/analysis-cached';

export const setGFWMeta = createAction('setGFWMeta');
export const setGFWMetaLoading = createAction('setGFWMetaLoading');

export const fetchGfwMeta = createThunkAction(
  'fetchGfwMeta',
  () => async (dispatch) => {
    dispatch(setGFWMetaLoading({ loading: true, error: false }));
    try {
      const gladLatest = await fetchGLADLatest();
      const viirsLatest = await fetchVIIRSLatest();
      dispatch(
        setGFWMeta({
          datasets: {
            GLAD: {
              ...gladLatest?.attributes,
              ...(gladLatest?.attributes?.updatedAt && {
                defaultStartDate: moment(gladLatest?.attributes.updatedAt)
                  .add(-7, 'days')
                  .format('YYYY-MM-DD'),
                defaultEndDate: gladLatest?.attributes.updatedAt,
              }),
            },
            VIIRS: {
              ...viirsLatest,
              ...(viirsLatest?.date && {
                defaultStartDate: moment(viirsLatest?.date)
                  .add(-7, 'days')
                  .format('YYYY-MM-DD'),
                defaultEndDate: viirsLatest?.date,
              }),
            },
          },
        })
      );
      dispatch(
        setGFWMetaLoading({ loading: false, error: false, initialized: true })
      );
    } catch (_) {
      dispatch(
        setGFWMetaLoading({ loading: false, error: true, initialized: true })
      );
    }
  }
);
