import { createSelector } from 'reselect';

// get list data
const getSettings = state => state.settings || null;

// get lists selected
export const getStatement = createSelector([getSettings], settings => {
  if (!settings) return '';

  const statements = [];
  Object.keys(settings).forEach(key => {
    switch (key) {
      case 'extentYear':
        statements[0] = `${settings[key]} tree cover extent`;
        break;
      case 'threshold':
        statements[1] = `>${settings[key]}% tree canopy`;
        break;
      default:
        break;
    }
  });

  return statements.join(' | ');
});
