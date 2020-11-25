import {
  FOREST_LOSS
} from './layers';

export default {
  [FOREST_LOSS]: {
    sum: ['area__ha'],
    groupBy: ['umd_tree_cover_loss__year'],
    filters: ['umd_tree_cover_density_{extentYear}__{threshold}'],
  }
}
