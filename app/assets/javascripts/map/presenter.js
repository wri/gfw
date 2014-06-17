/**
 * The presenter module.
 *
 * Presenter fires events in response to changing URL routes.
 * 
 * @return singleton instance of Presenter class.
 */
define([
  'backbone',
  'mps',
  'collections/layers',
], function (Backbone, mps, layers) {

  var Presenter = Backbone.Model.extend({

    defaults: {
      baseLayer: '',
      zoom: 0,
      mapType: ''
    },

    initialize: function() {
      this.on('change', this.updateUrl, this);
    },

    setFromUrl: function(arr) {
      var baseLayer = layers.getBaselayer(arr.baseLayer).slug;

      var attrs = {
        baseLayer: baseLayer   || 'umd_tree_loss_gain',
        zoom:      arr.zoom    || 3,
        mapType:   arr.mapType || 'terrain'
      };

      this.set(attrs);
    },

    // TODO: Only router should call navigate via mps events.
    updateUrl: function() {
      var place = {
        path: _.values(this.toJSON()).join('/'),
        trigger: false
      };
      mps.publish('navigate', [place]);
    }

  });

  var presenter = new Presenter();

  return presenter;

});