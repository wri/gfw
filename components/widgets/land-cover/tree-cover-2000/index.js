import treeCover from 'components/widgets/land-cover/tree-cover';
import { FOREST_EXTENT_DATASET } from 'data/layers-datasets';
import { TREE_COVER } from 'data/layers';

export default {
  ...treeCover,
  widget: 'treeCover2000',
  datasets: [
    // tree cover
    {
      dataset: FOREST_EXTENT_DATASET,
      layers: [TREE_COVER]
    }
  ],
  visible: ['analysis'],
  settings: {
    threshold: 30,
    extentYear: 2000
  }
};
