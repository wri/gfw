import { createStructuredSelector } from 'reselect';

import { getMapSettings } from 'components/map/selectors';

export const getMapControlsProps = createStructuredSelector({
  mapSettings: getMapSettings
});
