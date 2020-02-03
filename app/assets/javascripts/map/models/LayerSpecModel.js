/**
 * The LayerSpecModel model.
 *
 * @return LayerSpecModel (extends Backbone.Model).
 */

/* eslint-disable */

define(['underscore', 'backbone'], function(_, Backbone) {
  var LayerSpecModel = Backbone.Model.extend({
    // You should put more importants layers at the bottom of the layerOrder
    // As you see forestchange layers are the more importants so they will be added to top
    // the order will be Grump, forest cover,Conservation, Forest Use, and People layers and finally  Forest Change layers
    layerOrder: [
      // high resolution maps
      'highres',
      'sentinel_tiles',
      //-
      'grump2000',
      'mex_forest_zoning_cat',
      'mex_forest_zoning_subcat',
      // FOREST/LAND COVER CONTEXTUAL LAYER
      'forma_coverage',
      'forest2000',
      'forest2010',
      'per_minam_tree_cover',
      'cod_primary_forest_wgs',
      'can_ifl',
      'WMSLayer',
      'global_land_cover',
      'us_land_cover',
      'mex_land_cover',
      'gtm_forest_cover',
      'bra_rtrs',
      'pry_rtrs',
      'gtm_forest_density',
      'gtm_forest_change2',
      'gtm_forest_change1',
      'us_land_cover_change',
      'colombia_forest_change',
      'intact_forest',
      'primary_forest',
      'pantropical',
      'idn_primary',
      'ifl_2013_deg',
      'ifl_2000',
      'mangrove_watch',
      'plantations_by_type',
      'plantations_by_species',
      'bra_plantations_by_type',
      'bra_plantations_by_species',
      'per_plantations_by_type',
      'per_plantations_by_species',
      'lbr_plantations_by_type',
      'lbr_plantations_by_species',
      'col_plantations_by_type',
      'col_plantations_by_species',
      'khm_plantations_by_type',
      'khm_plantations_by_species',
      'idn_forest_cover',
      'idn_forest_area',
      'idn_plantations_by_type',
      'idn_plantations_by_species',
      'mys_plantations_by_type',
      'mys_plantations_by_species',
      'khm_eco_land_conc',
      'usa_forest_ownership',
      'idn_peat_lands',
      'pak_user_mangroves',
      'sen_user_protected_areas',
      'hti_user_watersheds',
      'ecu_user_protected_areas',
      'bol_user_fire_frequency',
      // PEOPLE
      'resource_rights',
      'cmr_resource_rights',
      'lbr_resource_rights',
      'gnq_resource_rights',
      'nam_resource_rights',
      'land_rights',
      'aus_land_rights',
      'pan_land_rights',
      'bra_land_rights',
      'can_land_rights',
      'cri_land_rights',
      'nzl_land_rights',
      'raisg',
      'mex_land_rights',
      // CONSERVATION
      'biodiversity_hotspots',
      'biodiversity_intactness',
      'biodiversity_completeness',
      'verified_carbon',
      'azepoly',
      'wwf',
      'usa_conservation_easements',
      'birdlife',
      'tigers',
      'bra_biomes',
      'map_biomas',
      'biodiversity_hotspots',
      'protected_areasCDB',
      'khm_pa',
      'idn_leuser',
      'per_buffer',
      'per_nat_pa',
      'per_priv_pa',
      'per_reg_pa',
      'mys_proteced_areas_sabah',
      'per_protected_areas',
      // Land USE
      'per_prod_for',
      'concesiones_wrapper',
      'concesiones_forestalesNS',
      'concesiones_forestales',
      'mys_wood_fiber',
      'idn_wood_fiber',
      'cog_wood_fiber',
      'gab_wood_fiber',
      'wood_fiber_plantations',
      'cog_oil_palm',
      'lbr_oil_palm',
      'cmr_oil_palm',
      'idn_oil_palm',
      'idn_suitability',
      'mys_oil_palm',
      'oil_palm',
      'rspo_oil_palm',
      'bra_mining',
      'bra_soy',
      'mex_mining',
      'per_mining',
      'can_oil',
      'can_mining',
      'col_mining',
      'khm_mining',
      'gab_mining',
      'cog_mining',
      'cod_mining',
      'cmr_mining',
      'mining',
      'gab_logging',
      'caf_logging',
      'idn_for_mor',
      'idn_logging',
      'gnq_logging',
      'cmr_logging',
      'cod_logging',
      'cog_logging',
      'mys_logging',
      'mys_logging_sabah',
      'logging',
      'logging_roads',
      'raisg_mining',
      'mexican_psa',
      'bra_logging',
      'mys_wood_fiber_sabah',
      // STORIES
      'infoamazonia',
      'mongabay',
      'user_stories',
      // FOREST CHANGE
      'gfw_landsat_alerts_coverage',
      'glad_coverage',
      'terraicanvas_cover',
      'imazon_cover',
      'gran_chaco_extent',
      // FOREST CHANGE
      'per_minam_loss',
      'mangrove_2',
      'guyra',
      'terrailoss',
      'imazon',
      'peru_forma_250',
      'brazil_forma_250',
      'laos_forma_250',
      'indonesia_forma_250',
      'drc_forma_250',
      'prodes',
      'loss',
      'loss_by_driver',
      'forestgain',
      'gfw_landsat_alerts',
      'umd_as_it_happens',
      'umd_as_it_happens_per',
      'umd_as_it_happens_idn',
      'umd_as_it_happens_cog',
      'uncurated_places_to_watch',
      'places_to_watch',
      'forma_month_3',
      'forma_activity',
      'oil_palm_mills',
      'dam_hotspots',
      'viirs_fires_alerts'
    ],

    categoryOrder: [
      'forest_clearing',
      'forest_cover',
      'forest_use',
      'people',
      'conservation',
      'stories',
      'hrmap'
    ],

    /**
     * Add a position attribute to the provided layers.
     *
     * @param  {object} layers
     * @return {object} layers
     */
    positionizer: function(layers) {
      var layerOrder = _.intersection(this.layerOrder, _.pluck(layers, 'slug'));
      _.each(
        layerOrder,
        _.bind(function(slug, i) {
          layers[slug].position = this.layerOrder.indexOf(slug);
        }, this)
      );

      return layers;
    },

    getLayer: function(where) {
      if (!where) {
        return;
      }
      var layer = _.findWhere(this.getLayers(), where, this);
      return layer;
    },

    /**
     * Get all the layers uncategorized.
     * {forest2000: {}, gain:{}, ...}
     *
     * @return {object} layers
     */
    getLayers: function() {
      var layers = {};

      _.each(this.toJSON(), function(category) {
        _.extend(layers, category);
      });

      return this.positionizer(layers);
    },

    /**
     * Return baselayers object.
     *
     * @return {object} baselayers
     */
    getBaselayers: function() {
      return this.positionizer(this.get('forest_clearing') || {});
    },

    getBaselayer: function() {
      var baselayers = _.keys(
        this.positionizer(this.get('forest_clearing') || {})
      );
      if (baselayers.length) {
        return this.getLayer({ slug: baselayers[0] });
      }
      return {};
    },

    /**
     * Return sublayers object.
     *
     * @return {object} sublayers
     */
    getSublayers: function() {
      var layers = {};

      _.each(_.omit(this.toJSON(), 'forest_clearing'), function(results) {
        layers = _.extend(layers, results);
      });

      return this.positionizer(layers);
    },

    /**
     * Return an ordered array of categories and layers.
     *
     * @return {array} categories
     */
    getLayersByCategory: function() {
      var categories = [];

      _.each(
        this.categoryOrder,
        _.bind(function(categoryName) {
          var category = this.get(categoryName);
          if (category) {
            categories.push(
              _.sortBy(this.positionizer(category), function(layer) {
                return layer.position;
              }).reverse()
            );
          }
        }, this)
      );

      return categories;
    }
  });

  return LayerSpecModel;
});
