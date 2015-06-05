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
      "grump2000",
      //FOREST COVER
      "forest2000",
      "WMSLayer",
      "global_land_cover",
      "us_land_cover",
      "us_land_cover_change",
      "colombia_forest_change",
      "intact_forest",
      "pantropical",
      "idn_primary",
      "ifl_2013_deg",
      "ifl_2000",
      "mangrove",
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
      // CONSERVATION
      "biodiversity_hotspots",
      "verified_carbon",
      "azepoly",
      "wwf",
      "usa_conservation_easements",
      "birdlife",
      "tigers",
      "biodiversity_hotspots",
      "protected_areasCDB",
      // FOREST USE
      "dam_hotspots",
      "concesiones_wrapper",
      "concesiones_forestalesNS",
      "concesiones_forestales",
      "idn_wood_fiber",
      "cog_wood_fiber",
      "gab_wood_fiber",
      "wood_fiber_plantations",
      "cog_oil_palm",
      "lbr_oil_palm",
      "cmr_oil_palm",
      "idn_oil_palm",
      "oil_palm",
      "can_claims",
      "can_leases",
      "can_coal",
      "can_permits",
      "col_mining",
      "khm_mining",
      "gab_mining",
      "cog_mining",
      "cod_mining",
      "cmr_mining",
      "mining",
      "gab_logging",
      "cod_logging",
      "caf_logging",
      "cmr_logging",
      "idn_logging",
      "gnq_logging",
      "gnq_logging",
      "idn_logging",
      "cmr_logging",
      "cod_logging",
      "logging",
      //STORIES
      "infoamazonia",
      "mongabay",
      "user_stories",
      // FOREST CHANGE
      "terraicanvas_cover",
      "forma_cover",
      "imazon_cover",
      "modis_cover",
      // FOREST CHANGE
      "terrailoss",
      "fires",
      "modis",
      "imazon",
      "forma",
      "loss",
      "forestgain"
    ],

    categoryOrder: [
      'forest_clearing',
      'forest_cover',
      'forest_use',
      'people',
      'conservation',
      'stories'
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
