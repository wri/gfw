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
    },{
      'Analysis/delete': function() {
        this.status.set('active', false);
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
      var parseDownloads = {};

      _.each(downloads, function(link, key) {
        if ((key === 'csv' || key === 'json') && link && link.indexOf('/download/') !== -1) {
          parseDownloads[key] = window.gfw.config.GFW_API + link;
        } else {
          parseDownloads[key] = link;
        }
      });

      if (!!parseDownloads) {
        return  _.extend({}, parseDownloads, {
          cdb: (!!parseDownloads.kml) ? encodeURIComponent(parseDownloads.kml + '&filename=GFW_Analysis_Results') : null
        });
      }
      return null;
    }


  });

  return AnalysisDownloadPresenter;

});
