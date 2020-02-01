import { createStructuredSelector } from 'reselect';

import { getUserAreas } from 'providers/areas-provider/selectors';

const selectAreasLoading = state => state.areas && state.areas.loading;

export const getMyGFWProps = createStructuredSelector({
  loading: selectAreasLoading,
  areas: getUserAreas
});
