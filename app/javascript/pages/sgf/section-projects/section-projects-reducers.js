import { allProjectsCategory } from './section-projects-selectors';

export const initialState = {
  loading: false,
  loaded: false,
  error: false,
  search: '',
  data: [],
  categorySelected: allProjectsCategory
};

const setLoading = (state, loading) => ({ ...state, loading });
const setError = (state, error) => ({ ...state, error });
const setLoaded = (state, loaded) => ({ ...state, loaded });

export default {
  fetchProjectsInit: state => setLoading(state, true),
  fetchProjectsReady: (state, { payload }) =>
    setLoaded(setLoading({ ...state, data: payload }, false), true),
  fetchProjectsFail: state => setError(state, true),
  setCategorySelected: (state, { payload }) => ({
    ...state,
    categorySelected: payload
  }),
  setSearch: (state, { payload }) => ({
    ...state,
    search: payload
  })
};
