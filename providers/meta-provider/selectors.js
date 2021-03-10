import { createStructuredSelector } from 'reselect';

import { setGFWMeta, setGFWMetaLoading, fetchGfwMeta } from './actions';

export const gfwMetaLoading = (state) => state.meta.loading;

export const getGFWMeta = (state) => ({
  datasets: state.meta.datasets,
});

export const getLatestProps = createStructuredSelector({
  setGFWMeta,
  setGFWMetaLoading,
  fetchGfwMeta,
});
