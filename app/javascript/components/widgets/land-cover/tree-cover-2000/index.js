import treeCover from 'components/widgets/land-cover/tree-cover';
import { FOREST_EXTENT_DATASET } from 'data/layers-datasets';

export default {
  ...treeCover,
  widget: 'treeCover2000',
  datasets: [
    // tree cover
    {
      dataset: FOREST_EXTENT_DATASET,
      layers: ['c05c32fd-289c-4b20-8d73-dc2458234e04']
    }
  ],
  visible: ['analysis'],
  settings: {
    threshold: 30,
    extentYear: 2000
  }
};
