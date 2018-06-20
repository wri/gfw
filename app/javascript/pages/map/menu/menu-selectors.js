import { createSelector } from 'reselect';

import arrowIcon from 'assets/icons/flechita.svg';
import ForestChange from './components/forest-change';

export const getSections = createSelector([], () => ({
  'forest-change': {
    name: 'FOREST CHANGE',
    icon: arrowIcon,
    Component: ForestChange
  }
}));
