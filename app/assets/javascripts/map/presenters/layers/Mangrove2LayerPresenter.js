/**
 * The Mangrove2Presenter.
 *
 * @return Mangrove2Presenter class
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      layerOptions: []
    }
  });

  var Mangrove2Presenter = PresenterClass.extend({

    init: function(view, slug) {
      this.view = view;
      this.slug = slug;

      this.status = new StatusModel();
      this._super();

      mps.publish('Place/register', [this]);
      this.status.on('change:layerOptions', view.updateTiles.bind(view));
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'LayerNav/changeLayerOptions': function(layerOptions) {
        this.setFilters(layerOptions);
      },
      'LayerNav/change': function(layerSpec) {
        var isLayerSelected = layerSpec.getLayer({ slug: this.slug });
        if (!isLayerSelected) {
          mps.publish('LayerOptions/delete', []);
        }
      },
      'Timeline/date-change': function(layerSlug, date) {
        if (this.view.getName() !== layerSlug) {
          return;
        }
        this.view.setCurrentDate(date);
        this.view.updateTiles();
      }
    }],

    setFilters: function(layerOptions) {
      var filters = layerOptions || [];

      this.status.set('layerOptions', _.clone(filters));
    },

    /**
     * Used by PlaceService
     */
    getPlaceParams: function() {
      var params = {};

      var layerOptions = this.status.get('layerOptions');
      if (layerOptions && layerOptions.length > 0) {
        params.layer_options = this.status.get('layerOptions');
      }

      return params;
    }
  });

  return Mangrove2Presenter;
});
