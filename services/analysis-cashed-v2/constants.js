export default {
  POLYNAME_CATEGORIES: ['forestType', 'landCategory'],
  ALLOWED_PARAMS: {
    annual: ['adm0', 'adm1', 'adm2', 'threshold', 'forestType', 'landCategory'],
    glad: [
      'adm0',
      'adm1',
      'adm2',
      'forestType',
      'landCategory',
      'is__confirmed_alert'
    ],
    viirs: ['adm0', 'adm1', 'adm2', 'forestType', 'landCategory', 'confidence'],
    modis: ['adm0', 'adm1', 'adm2', 'forestType', 'landCategory', 'confidence']
  },
  typeByGrouped: {
    global: {
      default: 'adm0',
      grouped: 'adm0'
    },
    adm0: {
      default: 'adm0',
      grouped: 'adm1'
    },
    adm1: {
      default: 'adm1',
      grouped: 'adm2'
    },
    adm2: {
      default: 'adm2',
      grouped: 'adm2'
    }
  },
  sql: {
    loss: 'SELECT umd_tree_cover_loss__year, SUM(whrc_aboveground_biomass_loss__Mg) as whrc_aboveground_biomass_loss__Mg, SUM(whrc_aboveground_co2_emissions__Mg) AS whrc_aboveground_co2_emissions__Mg, SUM(umd_tree_cover_loss__ha) AS umd_tree_cover_loss__ha FROM data {WHERE} AND umd_tree_cover_loss__year > 0 GROUP BY umd_tree_cover_loss__year ORDER BY umd_tree_cover_loss__year',
    lossTsc: 'SELECT tsc_tree_cover_loss_drivers__type, umd_tree_cover_loss__year, SUM(umd_tree_cover_loss__ha) AS umd_tree_cover_loss__ha, SUM(whrc_aboveground_biomass_loss__Mg) as whrc_aboveground_biomass_loss__Mg, SUM(whrc_aboveground_co2_emissions__Mg) AS whrc_aboveground_co2_emissions__Mg FROM data {WHERE} AND umd_tree_cover_loss__year > 0 GROUP BY tsc_tree_cover_loss_drivers__type, umd_tree_cover_loss__year'
  }
};
