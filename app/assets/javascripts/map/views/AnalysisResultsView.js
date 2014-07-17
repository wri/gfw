/**
 * The AnalysisResultsView selector view.
 *
 * @return AnalysisResultsView instance (extends Widget).
 */
define([
  'underscore',
  'views/Widget',
  'presenters/AnalysisResultsPresenter',
  'handlebars',
  'text!templates/analysisResults.handlebars'
], function(_, Widget, Presenter, Handlebars, tpl) {

  'use strict';

  var AnalysisResultsView = Widget.extend({

    className: 'widget analysis-results',
    template: Handlebars.compile(tpl),

    widgetOpts: {
      hidden: true,
    },

    events: function(){
      return _.extend({}, AnalysisResultsView.__super__.events, {
        // UI event handlers.
        'click .reset_control' : '_deleteAnalysis',
        'click .download'      : '_toggleDownload'
      });
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      AnalysisResultsView.__super__.initialize.apply(this);
    },

    printResultsUmd: function(results) {
      var ha    = this._calcAreaPolygon(results.params.geojson),
          $tpl  = this.$el.find('.umd');

      $tpl.find('.ha strong').html(ha);
      $tpl.find('.subtitle').html(results.meta.timescale);
      $tpl.find('.alerts-deg').html( results.value[0].value ? results.value[0].value.toLocaleString() : 0 );
      $tpl.find('.alerts-def').html( results.value[1].value ? results.value[1].value.toLocaleString() : 0 );
      $tpl.find('.svg-download').prop("href", results.download_urls.csv);
      $tpl.find('.geo-download').prop("href", results.download_urls.geojson);
      $tpl.find('.shp-download').prop("href", results.download_urls.shp);
      $tpl.find('.kml-download').prop("href", results.download_urls.kml);
      $tpl.find('.csv-download').prop("href", results.download_urls.csv);

      $tpl.fadeIn();
    },

    printResultsForma: function(results) {
      var ha    = this._calcAreaPolygon(results.params.geojson),
          $tpl  = this.$el.find('.forma');

      $tpl.find('.ha strong').html(ha);
      $tpl.find('.subtitle').html(results.meta.timescale);
      $tpl.find('#alerts-count').html( results.value : 0 );
      $tpl.find('.svg-download').prop("href", results.download_urls.csv);
      $tpl.find('.geo-download').prop("href", results.download_urls.geojson);
      $tpl.find('.shp-download').prop("href", results.download_urls.shp);
      $tpl.find('.kml-download').prop("href", results.download_urls.kml);
      $tpl.find('.csv-download').prop("href", results.download_urls.csv);

      $tpl.fadeIn();
    },

    printResultsImazon: function(results) {
      var ha    = this._calcAreaPolygon(results.params.geojson),
          $tpl  = this.$el.find('.imazon');

      $tpl.find('.ha strong').html(ha);
      $tpl.find('.subtitle').html(results.meta.timescale);
      $tpl.find('#alerts-count').html( results.value : 0 );
      $tpl.find('.svg-download').prop("href", results.download_urls.csv);
      $tpl.find('.geo-download').prop("href", results.download_urls.geojson);
      $tpl.find('.shp-download').prop("href", results.download_urls.shp);
      $tpl.find('.kml-download').prop("href", results.download_urls.kml);
      $tpl.find('.csv-download').prop("href", results.download_urls.csv);

      $tpl.fadeIn();
    },

    printResultsNasa: function(results) {
      var ha    = this._calcAreaPolygon(results.params.geojson),
          $tpl  = this.$el.find('.fires');

      $tpl.find('.ha strong').html(ha);
      $tpl.find('.subtitle').html(results.meta.timescale);
      $tpl.find('#alerts-count').html( results.value : 0 );
      $tpl.find('.svg-download').prop("href", results.download_urls.csv);
      $tpl.find('.geo-download').prop("href", results.download_urls.geojson);
      $tpl.find('.shp-download').prop("href", results.download_urls.shp);
      $tpl.find('.kml-download').prop("href", results.download_urls.kml);
      $tpl.find('.csv-download').prop("href", results.download_urls.csv);

      $tpl.fadeIn();
    },

    printResultsQuicc: function(results) {
      var ha    = this._calcAreaPolygon(results.params.geojson),
          $tpl  = this.$el.find('.quicc');

      $tpl.find('.ha strong').html(ha);
      $tpl.find('.subtitle').html(results.meta.timescale);
      $tpl.find('#alerts-count').html( results.value : 0 );
      $tpl.find('.svg-download').prop("href", results.download_urls.csv);
      $tpl.find('.geo-download').prop("href", results.download_urls.geojson);
      $tpl.find('.shp-download').prop("href", results.download_urls.shp);
      $tpl.find('.kml-download').prop("href", results.download_urls.kml);
      $tpl.find('.csv-download').prop("href", results.download_urls.csv);

      $tpl.fadeIn();
    },

    _calcAreaPolygon: function(polygon) {
      // https://github.com/maxogden/geojson-js-utils
      var area = 0;
      var points = polygon.coordinates;

      var j = points.length - 1;
      var p1, p2;

      for (var i = 0; i < points.length; j = i++) {
        var p1 = {
          x: points[i][1],
          y: points[i][0]
        };
        var p2 = {
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
    
    _deleteAnalysis: function(e) {
      e && e.preventDefault();
      this.presenter.deleteAnalysis();
      this.$el.find('.analysis_info').fadeOut()
    },
    
    _toggleDownload: function(e) {
      e && e.preventDefault();
      this.$el.find('.analysis_dropdown').toggleClass('hidden')
    }
  });

  return AnalysisResultsView;

});