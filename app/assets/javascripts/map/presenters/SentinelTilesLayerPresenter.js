define([
  'mps', 'backbone', 'moment', 'map/presenters/PresenterClass'
], function(mps, Backbone, moment, PresenterClass) {

  'use strict';

  var StatusModel = Backbone.Model.extend({});

  var SentinelTilesLayerPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();

      this.status = new StatusModel();
    },

    _subscriptions: [{
      'SentinelTiles/update': function(params) {
        if (params !== null) {
          params = JSON.parse(atob(params));

          this.view.setCurrentDate([
            moment.utc(params.mindate),
            moment.utc(params.maxdate)
          ]);
        }
      }
    }]

  });

  return SentinelTilesLayerPresenter;

});
