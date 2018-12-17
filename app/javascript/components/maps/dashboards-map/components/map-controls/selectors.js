import { createStructuredSelector } from 'reselect';

import { getMapSettings } from 'components/maps/map/selectors';

export const getMapControlsProps = createStructuredSelector({
  mapSettings: getMapSettings
});
