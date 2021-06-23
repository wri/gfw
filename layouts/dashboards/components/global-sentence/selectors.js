import { createStructuredSelector } from 'reselect';

import { getActiveCategory } from 'components/widgets/selectors';

import {
  selectLocation,
  getAdminsSelected,
  selectLoading,
} from 'layouts/dashboards/components/header/selectors';

export const getGlobalSentenceProps = createStructuredSelector({
  loading: selectLoading,
  location: selectLocation,
  locationNames: getAdminsSelected,
  category: getActiveCategory,
});
