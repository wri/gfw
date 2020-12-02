import {
  AREA_HA,
  TREE_COVER_LOSS_YEAR,
  TREE_COVER_DENSITY
} from 'data/layers-v2';

export default {
  loss: {
    sum: [AREA_HA],
    groupBy: [TREE_COVER_LOSS_YEAR],
    filters: [TREE_COVER_DENSITY]
  },
  extent: {
    sum: [AREA_HA],
    filters: [TREE_COVER_DENSITY]
  }
};
