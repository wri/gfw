import * as actions from './actions';

export const initialState = {
  open: false,
};

const setSectionProjectsModalSlug = (state, { payload }) => ({
  ...state,
  open: payload,
});

export default {
  [actions.setSectionProjectsModalSlug]: setSectionProjectsModalSlug,
};
