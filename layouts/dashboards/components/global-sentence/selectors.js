import { createStructuredSelector } from 'reselect';

import { getActiveCategory } from 'components/widgets/selectors';

import {
  selectLocation,
  getAdminsSelected,
} from 'layouts/dashboards/components/header/selectors';

export const getGlobalSentenceProps = createStructuredSelector({
  location: selectLocation,
  locationNames: getAdminsSelected,
  category: getActiveCategory,
});
