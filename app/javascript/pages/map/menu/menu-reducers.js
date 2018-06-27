export const initialState = {
  selectedSection: null,
  countries: null,
  explore: {
    section: 'topics'
  }
};

const setSelectedSection = (state, { payload }) => ({
  ...state,
  selectedSection: state.selectedSection === payload ? null : payload
});

const setMenuCountries = (state, { payload }) => ({
  ...state,
  countries: {
    ...state.countries,
    ...payload
  }
});

const setMenuExplore = (state, { payload }) => ({
  ...state,
  explore: {
    ...state.explore,
    ...payload
  }
});

export default {
  setSelectedSection,
  setMenuCountries,
  setMenuExplore
};
