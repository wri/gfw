define([
  'map/presenters/TorqueLayerPresenter'
], function(TorqueLayerPresenter) {

  'use strict';


  var StatusModel = Backbone.Model.extend({
  });


  var GladLayerPresenter = TorqueLayerPresenter.extend({

    init: function(view) {
      this.view = view;
      this._super();

      this.status = new StatusModel();
      this.status.on('change:hideUnconfirmed', view.updateTiles.bind(view));
    },

    _subscriptions: [{
      'LayerNav/changeLayerOptions': function(layerOptions) {
        this.setConfirmedStatus(layerOptions);
      }
    }],

    setConfirmedStatus: function(layerOptions) {
      layerOptions = layerOptions || [];
      this.status.set('hideUnconfirmed',
        layerOptions.indexOf('glad_confirmed_only') > -1);
    }

  });

  return GladLayerPresenter;

});
