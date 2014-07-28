/**
 * The Analysis view.
 *
 * @return Analysis view (extends Widget.View)
 */
define([
  'underscore',
  'handlebars',
  'views/Widget',
  'presenters/AnalysisResultsPresenter',
  'text!templates/analysisResults.handlebars'
], function(_, Handlebars, Widget, Presenter, tpl) {

  'use strict';

  var AnalysisResultsView = Widget.extend({

    className: 'widget widget-analysis-results',

    template: Handlebars.compile(tpl),

    options: {
      hidden: false,
      boxHidden: true,
      boxClosed: false
    },

    events: function(){
      return _.extend({}, AnalysisResultsView.__super__.events, {
        'click .delete-analysis': '_deleteAnalysis',
        'click .download_links span' :'_toggleDownloads'
      });
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      AnalysisResultsView.__super__.initialize.apply(this);
    },

    _cacheSelector: function() {
      AnalysisResultsView.__super__._cacheSelector.apply(this);
    },

    renderAnalysis: function(results, layer) {
      var p = {};
      p[layer.slug] = true;
      p.totalAlerts = (results.value.toLocaleString() || 0) + ' ' + layer.slug;
      if (layer.slug == 'imazon') {
        p.degradation   = (results.value[0].value.toLocaleString() || 0) + ' Imazon';
        p.deforestation = (results.value[1].value.toLocaleString() || 0) + ' Imazon';
      }
      p.totalArea = (results.params.geojson) ? this._calcAreaPolygon(results.params.geojson) : 0;
      p.timescale = results.meta.timescale;
      p.svg = results.download_urls.csv;
      p.geo = results.download_urls.geojson;
      p.shp = results.download_urls.shp;
      p.kml = results.download_urls.kml;
      p.csv = results.download_urls.csv;
      p.layer = layer;

      // p.dateRange = '{0} to {1}'.format(layer.mindate.format('MMM-YYYY'),
      //   layer.maxdate.format('MMM-YYYY'));
      this._update(this.template(p));
      this.model.set('boxHidden', false);
    },

    /**
     * Render failure analysis request message.
     */
    renderFailure: function() {
      var p = {};
      p.failure = true;
      this._update(this.template(p));
      this.model.set('boxHidden', false);
    },

    _deleteAnalysis: function() {
      this.presenter.deleteAnalysis();
    },

    _calcAreaPolygon: function(polygon) {
      // https://github.com/maxogden/geojson-js-utils
      var area = 0;
      var points = polygon.coordinates[0];

      var j = points.length - 1;
      var p1, p2;

      for (var i = 0; i < points.length; j = i++) {
        var pt = points[i];
        if (Array.isArray(pt[0])){
          pt[1] = pt[0][1];
          pt[0] = pt[0][0];
        }
        p1 = {
          x: pt[1],
          y: pt[0]
        };
        p2 = {
          x: points[j][1],
          y: points[j][0]
        };
        area += p1.x * p2.y;
        area -= p1.y * p2.x;
      }

      area /= 2;
      area = Math.abs(area);

      return (Math.ceil((area*1000000) * 10) / 10).toLocaleString();
    },

    _toggleDownloads: function() {
      $('.analysis_dropdown').stop().fadeToggle();
    }
  });

  return AnalysisResultsView;

});
