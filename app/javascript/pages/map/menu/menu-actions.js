import { createAction } from 'redux-actions';

const setSelectedSection = createAction('setSelectedSection');
const setMenuCountries = createAction('setMenuCountries');

export default {
  setSelectedSection,
  setMenuCountries
};
