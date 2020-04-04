import { createStructuredSelector } from 'reselect';

import { getUserAreas, getAreaTags } from 'providers/areas-provider/selectors';

export const getAreasTableProps = createStructuredSelector({
  areas: getUserAreas,
  tags: getAreaTags
});
