import { createStructuredSelector } from 'reselect';

import { getTags } from 'components/map-menu/components/sections/my-gfw/selectors';
import { getUserAreas } from 'providers/areas-provider/selectors';

export const getAreasTableProps = createStructuredSelector({
  areas: getUserAreas,
  tags: getTags
});
