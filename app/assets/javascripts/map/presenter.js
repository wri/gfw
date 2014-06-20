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
  'collections/layers'
], function (Backbone, mps, layersCollection) {

  var Presenter = Backbone.Model.extend({

    baselayersOpts: {
      allowedCombined: [
        ['loss', 'umd_tree_loss_gain']
      ]
    },

    initialize: function() {
      var self = this;

      this.on('change', this.updateUrl, this);

      mps.subscribe('presenter/toggle-layer', function(layerName) {
        self.toggleLayer(layerName);
      });
    },

   /**
    * Set the presenter object with the passed attributes.
    *
    * @param attrs Router params object.
    */
    setFromUrl: function(attrs) {
      var baselayers = null,
          sublayers = (attrs.sublayers) ? attrs.sublayers.split(',') : null,
          latLng = (attrs.lat && attrs.lng) ? [attrs.lat, attrs.lng] : null;

      if (attrs.baselayers &&
        this.validateBaselayers(attrs.baselayers.split(','))) {
        baselayers = attrs.baselayers.split(',');
      }

      var results = {
        zoom:       attrs.zoom    || 3,
        latLng:     latLng        || [15.00, 27.00],
        iso:        attrs.iso     || 'ALL',
        maptype:    attrs.maptype || 'terrain',
        baselayers: baselayers    || ['loss', 'umd_tree_loss_gain'],
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
    },

   /**
    * Toggle a layer on the presenter
    *
    * @param {string} LayerName.
    */
    toggleLayer: function(layerName) {
      if (layersCollection.getBaselayer(layerName)) {
        this.toggleBaselayer(layerName);
      } else if (layersCollection.getSublayer(layerName)) {
        this.toggleSublayer(layerName, layersCollection.getSublayer(layerName).id);
      }
    },

    toggleBaselayer: function(layerName) {
     var currentBaselayers = _.clone(presenter.get('baselayers')),
         layerIndex = currentBaselayers.indexOf(layerName);

      if (layerIndex > -1) {
        if (currentBaselayers.length > 1) {
          currentBaselayers.splice(layerIndex, 1);
          presenter.set('baselayers', currentBaselayers);
        }
      } else {
        var combined = presenter.get('baselayers').concat(layerName);

        if (this.validateBaselayers(combined)) {
          presenter.set('baselayers', combined);
        } else {
          presenter.set('baselayers', [layerName]);
        }
      }
    },

    toggleSublayer: function(layerName, layerId) {
      var currentSublayers = _.clone(presenter.get('sublayers'));
          layerIndex = currentSublayers.indexOf(layerId);

      if (layerIndex > -1) {
        currentSublayers.splice(layerIndex, 1);
        presenter.set('sublayers', currentSublayers);
      } else {
        var combined = presenter.get('sublayers').concat(layerId);
        presenter.set('sublayers', combined);
      }
    },

   /**
    * Validates baselayers are valid.
    *
    * @param {array} Baselayers array.
    */
    validateBaselayers: function(baselayersArr) {
      var valid = false;

      _.each(this.baselayersOpts.allowedCombined, 
        function(layersArr) {
          if (baselayersArr.length == 1 || 
              ($(baselayersArr).not(layersArr).length === 0 && 
              $(layersArr).not(baselayersArr).length === 0)) {
          valid = true;
        }
      });

      return valid;
    },

  });

  var presenter = new Presenter();

  return presenter;

});