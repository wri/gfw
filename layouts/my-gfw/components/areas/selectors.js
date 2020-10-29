import { createStructuredSelector } from 'reselect';

const selectAreasLoading = (state) => state.areas?.loading;
const selectHasAreas = (state) => state.areas?.data?.length > 0;

export const getAreasProps = createStructuredSelector({
  loading: selectAreasLoading,
  hasAreas: selectHasAreas,
});
