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

    /**
     * Return baselayers object.
     *
     * @return {object} baselayers
     */
    getBaselayers: function() {
      return this.get('forest_clearing');
    },

    /**
     * Return sublayers object.
     *
     * @return {object} sublayers
     */
    getSublayers: function() {
      var sublayers = {};

      _.each(_.omit(this.toJSON(), 'forest_clearing'),
        function(layers) {
          sublayers = _.extend(sublayers, layers);
        });

      return sublayers;
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

      return layers;
    },

    getLayer: function(where) {
      return _.findWhere(this.getLayers(), where, this);
    }
  });

  return LayerSpecModel;

});
