import {
  AREA_HA,
  ALERT_COUNT,
  GLAD_ALERTS_ISO_WEEK,
  TREE_COVER_LOSS_YEAR,
  TREE_COVER_DENSITY,
  TREE_COVER_GAIN,
  CARBON_EMISSIONS
} from 'data/layers-v2';

export default {
  loss: {
    sum: [AREA_HA],
    groupBy: [TREE_COVER_LOSS_YEAR],
    filters: [TREE_COVER_DENSITY]
  },
  gain: {
    sum: [AREA_HA],
    groupBy: [TREE_COVER_GAIN],
    filters: [TREE_COVER_GAIN]
  },
  areaHa: {
    sum: [AREA_HA]
  },
  extent: {
    sum: [AREA_HA],
    filters: [TREE_COVER_DENSITY]
  },
  gladAlerts: {
    sum: [AREA_HA, ALERT_COUNT],
    groupBy: [GLAD_ALERTS_ISO_WEEK]
  },
  emissionsDeforestation: {
    sum: [AREA_HA],
    groupBy: [CARBON_EMISSIONS],
    filters: [TREE_COVER_DENSITY]
  }
};
