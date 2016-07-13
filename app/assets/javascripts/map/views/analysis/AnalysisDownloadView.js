/**
 * The AnalysisDownloadView selector view.
 *
 * @return AnalysisDownloadView instance (extends Backbone.View).
 */
define([
  'underscore',
  'handlebars',
  'map/presenters/analysis/AnalysisDownloadPresenter',
  'text!map/templates/analysis/analysis-download.handlebars'
], function(_, Handlebars, Presenter, tpl) {

  'use strict';

  var AnalysisDownloadView = Backbone.View.extend({

    el: '#analysis-downloads',

    template: Handlebars.compile(tpl),

    events: {},

    initialize: function(map, countries) {
      this.map = map;
      this.countries = countries;
      this.presenter = new Presenter(this);
    },

    cache: function(){

    },

    render: function(){
      this.$el.html(this.template({
        downloads: this.presenter.status.get('downloads')
      }));
    },

    toggle: function() {
      this.$el.toggleClass('-active', this.presenter.status.get('active'));
    }


  });
  return AnalysisDownloadView;

});
