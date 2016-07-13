/**
 * The AnalysisDownloadPresenter class for the AnalysisResultsView.
 *
 * @return AnalysisDownloadPresenter class.
 */
define([
  'map/presenters/PresenterClass',
  'underscore',
  'backbone',
  'mps'
], function(PresenterClass, _, Backbone, mps) {

  'use strict';

  var AnalysisDownloadPresenter = PresenterClass.extend({

    status: new (Backbone.Model.extend({
      defaults: {
        active: false,
        downloads: null
      }
    })),

    init: function(view) {
      this.view = view;
      this._super();
      this.listeners();
    },

    listeners: function() {
      this.status.on('change:active', this.changeActive.bind(this));
      this.status.on('change:downloads', this.changeDownloads.bind(this));
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Analysis/downloads': function(downloads) {
        this.status.set('downloads', this.parseDownloads(downloads));
      }
    },{
      'Analysis/downloads-toggle': function(active) {
        this.status.set('active', active);
      }
    }],


    changeActive: function() {
      this.view.toggle();
    },

    changeDownloads: function() {
      this.view.render();
    },


    /**
     * HELPERS
     */
    parseDownloads: function(downloads) {
      if (!!downloads) {
        return  _.extend({}, downloads, {
          cdb: (!!downloads.kml) ? encodeURIComponent(downloads.kml + '&filename=GFW_Analysis_Results') : null
        });
      }
      return null;
    }


  });

  return AnalysisDownloadPresenter;

});
