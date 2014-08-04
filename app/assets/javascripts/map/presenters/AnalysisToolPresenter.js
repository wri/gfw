/**
 * The AnalysisToolPresenter class for the AnalysisToolView.
 *
 * @return AnalysisToolPresenter class.
 */
define([
  'Class',
  'underscore',
  'backbone',
  'mps',
  'services/CountryService'
], function(Class, _, Backbone, mps, countryService) {

  'use strict';

  var AnalysisToolPresenter = Class.extend({

    datasets: {
      'umd_tree_loss_gain': 'umd-loss-gain',
      'forestgain': 'umd-loss-gain',
      'forma': 'forma-alerts',
      'imazon': 'imazon-alerts',
      'fires': 'nasa-active-fires',
      'modis': 'quicc-alerts'
    },

    init: function(view) {
      this.view = view;

      this.status = new (Backbone.Model.extend())({
        currentDate: null,
        baselayer: null,
        analysis: null,
        disabled: false
      });

      this._subscribe();
    },

    _subscribe: function() {
      // when layer change, set new baselayer and visibility
      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        console.log('set baselayer');
        this._setBaselayer(layerSpec);
      }, this));

      // when new place go, set baselayer and vivbility
      // set current date
      // draw iso or geojson from place params
      mps.subscribe('Place/go', _.bind(function(place) {
        this._setBaselayer(place.layerSpec);

        if (place.params.begin && place.params.end) {
          this.status.set('currentDate', [place.params.begin,
            place.params.end]);
        }

        if (place.params.iso !== 'ALL') {
          this._drawIso(place.params.iso);
        } else if (place.params.geojson) {
          this._drawGeojson(place.params.geojson);
        }
      }, this));

      mps.subscribe('AnalysisResults/delete-analysis', _.bind(function() {
        this.view.deleteSelection();
        this.status.set('analysis', null);
      }, this));

      mps.subscribe('MapView/click-protected', _.bind(function(wdpaid) {
        this.publishAnalysis({wdpaid: wdpaid});
      }, this));

      // update analysis when timeline date change
      mps.subscribe('Timeline/date-change', _.bind(function(layerSlug, date) {
        console.log('date changed', date[0].format('YYYY-MM-DD'), date[1].format('YYYY-MM-DD'));
        this.status.set('currentDate', date);
        if (this.status.get('analysis') && !this.status.get('disabled')) {
          console.log('publish analysis again');
          this.publishAnalysis(this.status.get('analysis'));
        }
      }, this));

      mps.subscribe('Timeline/start-playing', _.bind(function() {
        this.status.set('disabled', true);
      }, this));

      mps.subscribe('Timeline/stop-playing', _.bind(function() {
        this.status.set('disabled', false);
        if (this.status.get('analysis')) {
          console.log('publish analysis when stop');
          this.publishAnalysis(this.status.get('analysis'));
        }
      }, this));

      mps.publish('Place/register', [this]);
    },

    /**
     * Set current baselayer from any layer change.
     */
    _setBaselayer: function(layerSpec) {
      var baselayers = layerSpec.getBaselayers();

      this.status.set('baselayer', baselayers[_.first(_.intersection(
        _.pluck(baselayers, 'slug'),
        _.keys(this.datasets)))]);

      this._setVisibility();
    },

    /**
     * Toggle hidden depending on active layers.
     */
    _setVisibility: function() {
      if (!this.status.get('baselayer')) {
        this._deleteAnalysis();
        this.view.model.set('hidden', true);
      } else {
        this.view.model.set('hidden', false);
      }
    },

    /**
     * Used by this presenter to delete analysis when the
     * current baselayer doesn't support analysis.
     */
    _deleteAnalysis: function() {
      mps.publish('AnalysisResults/delete-analysis', []);
      this.view._onClickCancel();
    },

    /**
     * Draw geom on the map and publish analysis of that geom.
     *
     * @param  {object} geom
     */
    _drawGeojson: function(geojson) {
      this.view.drawGeojson(geojson);
      this.publishAnalysis({geojson: geojson});
    },

    /**
     * Used by this presenter to draw a country and publish an analysis of that.
     *
     * @param  {string} iso Country iso
     */
    _drawIso: function(iso) {
      countryService.execute(iso, _.bind(function(results) {
        this.view.drawIso(results.topojson);
        this.publishAnalysis({iso: iso});
      },this));
    },

    /**
     * Publish an analysis and set the currentResource.
     */
    publishAnalysis: function(resource) {
      var data = _.extend({}, resource);
      var date = this.status.get('currentDate');
      data.dataset = this.datasets[this.status.get('baselayer').slug];
      data.period = '{0},{1}'.format(date[0].format('YYYY-MM-DD'), date[1].format('YYYY-MM-DD'));
      this.status.set('analysis', resource);
      mps.publish('AnalysisService/get', [data]);
    },

    /**
     * Generates a GEOJSON form a path.
     *
     * @param  {Array} path Array of google.maps.LatLng objects
     * @return {string} A GeoJSON string representing the path
     */
    createGeoJson: function(path) {
      var coordinates = null;

      coordinates = _.map(path, function(latlng) {
        return [
          _.toNumber(latlng.lng().toFixed(4)),
          _.toNumber(latlng.lat().toFixed(4))];
      });

      // First and last coordinate should be the same
      coordinates.push(_.first(coordinates));

      return JSON.stringify({
        'type': 'Polygon',
        'coordinates': [coordinates]
      });
    },

    /**
     * Convert a geojson into a path.
     *
     * @param  {object} geojson
     * @return {array} paths
     */
    geomToPath: function(geom) {
      var coords = JSON.parse(geom).coordinates[0];
      return _.map(coords, function(g) {
        return new google.maps.LatLng(g[1], g[0]);
      });
    },

    startDrawing: function() {
      mps.publish('AnalysisTool/start-drawing', []);
    },

    stopDrawing: function() {
      mps.publish('AnalysisTool/stop-drawing', []);
    },

    /**
     * Used by PlaceService to get the current iso/geom params.
     *
     * @return {object} iso/geom params
     */
    getPlaceParams: function() {
      var analysis = this.status.get('analysis');
      if (!analysis) {return;}
      var p = {};

      p.iso = null;
      p.geojson = null;

      if (analysis.iso) {
        p.iso = analysis.iso;
      } else if (analysis.geojson) {
        p.geojson = encodeURIComponent(analysis.geojson);
      }

      return p;
    }

  });

  return AnalysisToolPresenter;

});
