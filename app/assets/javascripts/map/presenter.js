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
      var baselayers = (attrs.baselayers) ? attrs.baselayers.split(',') : null,
          sublayers = (attrs.sublayers) ? attrs.sublayers.split(',') : null,
          latLng = (attrs.lat && attrs.lng) ? [attrs.lat, attrs.lng] : null;

      var results = {
        zoom:       attrs.zoom    || 3,
        latLng:     latLng        || [15.00, 27.00],
        iso:        attrs.iso     || 'ALL',
        maptype:    attrs.maptype || 'terrain',
        baselayers: baselayers    || ['loss', 'gain'],
        sublayers:  sublayers     || []
      };

      this.set(results);
    },

   /**
    * Update location with the presenter status. Calls router navigate.
    */
    updateUrl: function() {
      var attrs = {
        zoom:       this.get('zoom'),
        lat:        this.get('latLng')[0].toFixed(2),
        lng:        this.get('latLng')[1].toFixed(2),
        iso:        this.get('iso'),
        maptype:    this.get('maptype'),
        baselayers: this.get('baselayers'),
        sublayers:  this.get('sublayers')
      };

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