import { createStructuredSelector } from 'reselect';

import { getUserAreas, getAreaTags } from 'providers/areas-provider/selectors';

export default createStructuredSelector({
  areas: getUserAreas,
  tags: getAreaTags,
});
