// GFW layers
// Used within OTF service and analysis v2 service

/*
General layers
*/

export const AREA_HA = 'area__ha';
export const ALERT_COUNT = 'alert__count';

/*
  GLAD
*/

export const GLAD_ALERTS_ISO_WEEK = 'umd_glad_alerts__isoweek';

/*
  Tree cover
*/

export const TREE_COVER_LOSS_YEAR = 'umd_tree_cover_loss__year';
export const TREE_COVER_DENSITY =
  'umd_tree_cover_density_{extentYear}__{threshold}';
export const TREE_COVER_GAIN = 'is__umd_tree_cover_gain';

/*
  Carbon
*/

export const CARBON_EMISSIONS = 'whrc_aboveground_co2_emissions__Mg';

/*
  Biomass
*/

// TODO: Layers v1 has this constant, but its not the same ID
export const BIOMASS_LOSS = 'whrc_aboveground_biomass_stock_2000__Mg_ha-1';
