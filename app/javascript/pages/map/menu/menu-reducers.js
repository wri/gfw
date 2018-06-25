export const initialState = {
  selectedSection: null,
  countries: null
};

const setSelectedSection = (state, { payload }) => ({
  ...state,
  selectedSection: state.selectedSection === payload ? null : payload
});

export default {
  setSelectedSection
};
