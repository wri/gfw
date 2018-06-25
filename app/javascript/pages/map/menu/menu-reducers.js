export const initialState = {
  selectedSection: null
};

const setSelectedSection = (state, { payload }) => ({
  ...state,
  selectedSection: state.selectedSection === payload ? null : payload
});

export default {
  setSelectedSection
};
