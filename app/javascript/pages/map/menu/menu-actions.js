import { createAction } from 'redux-actions';

const setSelectedSection = createAction('setSelectedSection');
const setMenuCountries = createAction('setMenuCountries');
const setMenuExplore = createAction('setMenuExplore');

export default {
  setSelectedSection,
  setMenuCountries,
  setMenuExplore
};
