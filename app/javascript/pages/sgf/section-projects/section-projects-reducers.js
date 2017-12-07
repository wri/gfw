import { allProjectsCategory } from './section-projects-selectors';

export const initialState = {
  loading: false,
  loaded: false,
  search: '',
  data: [],
  categorySelected: allProjectsCategory
};

const setLoading = (state, loading) => ({ ...state, loading });
const setLoaded = (state, loaded) => ({ ...state, loaded });

export default {
  fetchProjectsInit: state => setLoading(state, true),
  fetchProjectsReady: (state, { payload }) =>
    setLoaded(setLoading({ ...state, data: payload }, false), true),
  setCategorySelected: (state, { payload }) => ({
    ...state,
    categorySelected: payload
  }),
  setSearch: (state, { payload }) => ({
    ...state,
    search: payload
  })
};
