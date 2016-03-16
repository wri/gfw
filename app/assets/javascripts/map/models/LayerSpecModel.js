/**
 * The LayerSpecModel model.
 *
 * @return LayerSpecModel (extends Backbone.Model).
 */
define([
  'underscore',
  'backbone'
], function(_, Backbone) {

  'use strict';

  var LayerSpecModel = Backbone.Model.extend({

    // You should put more importants layers at the bottom of the layerOrder
    // As you see forestchange layers are the more importants so they will be added to top
    //the order will be Grump, forest cover,Conservation, Forest Use, and People layers and finally  Forest Change layers
    layerOrder: [
      //high resolution maps
      "urthe",
      //-
      "grump2000",
      //FOREST COVER
      "forest2000",
      "cod_primary_forest_wgs",
      "WMSLayer",
      "global_land_cover",
      "us_land_cover",
      "gtm_forest_cover",
      "gtm_forest_density",
      "gtm_forest_change2",
      "gtm_forest_change1",
      "us_land_cover_change",
      "colombia_forest_change",
      "intact_forest",
      "pantropical",
      "idn_primary",
      "ifl_2013_deg",
      "ifl_2000",
      "mangrove",
      "plantations_by_type",
      "plantations_by_species",
      "bra_plantations_by_type",
      "bra_plantations_by_species",
      "per_plantations_by_type",
      "per_plantations_by_species",
      "lbr_plantations_by_type",
      "lbr_plantations_by_species",
      "col_plantations_by_type",
      "col_plantations_by_species",
      "khm_plantations_by_type",
      "khm_plantations_by_species",
      "idn_plantations_by_type",
      "idn_plantations_by_species",
      "mys_plantations_by_type",
      "mys_plantations_by_species",
      "khm_eco_land_conc",
      "usa_forest_ownership",
      "idn_peat_lands",
      // PEOPLE
      "resource_rights",
      "cmr_resource_rights",
      "lbr_resource_rights",
      "gnq_resource_rights",
      "nam_resource_rights",
      "land_rights",
      "aus_land_rights",
      "pan_land_rights",
      "bra_land_rights",
      "can_land_rights",
      "cri_land_rights",
      "nzl_land_rights",
      "raisg",
      // CONSERVATION
      "biodiversity_hotspots",
      "verified_carbon",
      "azepoly",
      "wwf",
      "usa_conservation_easements",
      "birdlife",
      "tigers",
      "bra_biomes",
      "biodiversity_hotspots",
      "protected_areasCDB",
      "khm_pa",
      "idn_leuser",
      "per_buffer",
      "per_nat_pa",
      "per_priv_pa",
      "per_reg_pa",
      // Land USE
      "dam_hotspots",
      "per_prod_for",
      "concesiones_wrapper",
      "concesiones_forestalesNS",
      "concesiones_forestales",
      "mys_wood_fiber",
      "idn_wood_fiber",
      "cog_wood_fiber",
      "gab_wood_fiber",
      "wood_fiber_plantations",
      "cog_oil_palm",
      "lbr_oil_palm",
      "cmr_oil_palm",
      "idn_oil_palm",
      "mys_oil_palm",
      "oil_palm",
      "bra_mining",
      "mex_mining",
      "per_mining",
      "can_mining",
      "col_mining",
      "khm_mining",
      "gab_mining",
      "cog_mining",
      "cod_mining",
      "cmr_mining",
      "mining",
      "gab_logging",
      "caf_logging",
      "idn_for_mor",
      "idn_logging",
      "gnq_logging",
      "cmr_logging",
      "cod_logging",
      "cog_logging",
      "mys_logging",
      "logging",
      "logging_roads",
      "raisg_mining",
      //STORIES
      "infoamazonia",
      "mongabay",
      "user_stories",
      // FOREST CHANGE
      "gfw_landsat_alerts_coverage",
      "terraicanvas_cover",
      "forma_cover",
      "forma_250_cover",
      "imazon_cover",
      "modis_cover",
      "gran_chaco_extent",
      // FOREST CHANGE
      "guyra",
      "terrailoss",
      "fires",
      "modis",
      "imazon",
      "forma",
      "peru_forma_250",
      "brazil_forma_250",
      "laos_forma_250",
      "indonesia_forma_250",
      "drc_forma_250",
      "prodes",
      "loss",
      "forestgain",
      "gfw_landsat_alerts",
      "umd_as_it_happens"
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
      _.each(layerOrder, _.bind(function(slug, i) {
        layers[slug].position = this.layerOrder.indexOf(slug);
      }, this ));

      return layers;
    },

    getLayer: function(where) {
      if (!where) {return;}
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

    /**
     * Return sublayers object.
     *
     * @return {object} sublayers
     */
    getSublayers: function() {
      var layers = {};

      _.each(_.omit(this.toJSON(), 'forest_clearing'),
        function(results) {
          layers = _.extend(layers, results);
        });

      return this.positionizer(layers);
    },

   /**
     * Return an ordered array of layers. Order by layer position.
     *
     * @return {array} layers
     */
    getOrderedLayers: function() {
      return _.sortBy(this.getLayers(), function(layer) {
        return layer.position;
      });
    },

    /**
     * Return an ordered array of categories and layers.
     *
     * @return {array} categories
     */
    getLayersByCategory: function() {
      var categories = [];

      _.each(this.categoryOrder, _.bind(function(categoryName) {
        var category = this.get(categoryName);
        if (category) {
          categories.push(_.sortBy(this.positionizer(category),
            function(layer) {
              return layer.position;
            }).reverse());
        }
      }, this));

      return categories;
    }

  });

  return LayerSpecModel;

});
