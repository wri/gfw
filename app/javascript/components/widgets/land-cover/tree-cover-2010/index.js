import treeCover from 'components/widgets/land-cover/tree-cover';
import { FOREST_EXTENT_DATASET } from 'data/layers-datasets';

import { FOREST_EXTENT } from 'data/layers';

export default {
  ...treeCover,
  widget: 'treeCover2010',
  datasets: [
    // tree cover
    {
      dataset: FOREST_EXTENT_DATASET,
      layers: [FOREST_EXTENT]
    }
  ],
  visible: ['analysis'],
  settings: {
    threshold: 30,
    extentYear: 2010
  }
};
