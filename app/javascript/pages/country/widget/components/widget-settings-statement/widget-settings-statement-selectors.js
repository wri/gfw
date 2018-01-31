import { createSelector } from 'reselect';
import compact from 'lodash/compact';

// get list data
const getSettings = state => state.settings || null;

// get lists selected
export const getStatement = createSelector([getSettings], settings => {
  if (!settings) return '';
  const { extentYear, threshold } = settings;
  const statements = compact([
    extentYear ? `${extentYear} tree cover extent` : null,
    threshold ? `>${threshold}% tree canopy` : null
  ]);

  return statements.join(' | ');
});
