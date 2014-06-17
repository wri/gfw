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
], function (Backbone, mps) {

  var Presenter = Backbone.Model.extend({

    initialize: function() {
      this.on('change', this.updateUrl, this);
    },

   /**
    * Set the presenter object with the passed attributes.
    * @param attrs Router params object.
    */
    setFromUrl: function(attrs) {
      var baseLayer = (attrs.baseLayer) ? attrs.baseLayer.split(',') : null;

      var results = {
        baseLayer: baseLayer     || ['loss', 'gain'],
        zoom:      attrs.zoom    || 3,
        mapType:   attrs.mapType || 'terrain'
      };

      this.set(results);
    },

    // TODO: Only router should call navigate via mps events.
    updateUrl: function() {
      var attrs = {
        baseLayer: this.get('baseLayer'),
        zoom: this.get('zoom'),
        mapType: this.get('mapType')
      }

      var place = {
        path: _.values(attrs).join('/'),
        trigger: false
      };
      mps.publish('navigate', [place]);
    }

  });

  var presenter = new Presenter();

  return presenter;

});