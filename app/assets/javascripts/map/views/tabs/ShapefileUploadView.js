define([
  'backbone', 'underscore', 'handlebars', 'mps', 'turf',
  'helpers/geojsonUtilsHelper',
  'map/services/ShapefileService',
], function(
  Backbone, _, Handlebars, mps, turf,
  geojsonUtilsHelper,
  ShapefileService
) {

  var ShapefileUploadView = Backbone.View.extend({

    template: function() {
      throw new Error("`template` must be implemented by child views");
    },

    events: {
      'click #continue': 'continue',
      'click #cancel': 'cancel'
    },

    initialize: function(options) {
      options = options || {};
      this.map = options.map;

      this.onCancel = options.onCancel || function(){};
      this.onSelect = options.onSelect || function(){};

      this.selectedFeatures = [];
      this.availableFeatures = [];

      this.render();

      this.setupHandlers();
      this.setupMap();
    },

    render: function() {
      var template = this.template({
        availableFeatures: this.availableFeatures,
        multipleFeatures: this.availableFeatures.length > 1,
        selectedFeatures: this.selectedFeatures
      });

      if (this.availableFeatures.length > 0) {
        this.$el.html(template);
      } else {
        this.$el.append(template);
      }

      return this;
    },

    setupMap: function() {
      this.map.data.addListener('click', function(event) {
        if (event.feature.getProperty('fromUpload') !== true) { return; }
        if (this.availableFeatures.length <= 1) { return; }

        event.feature.setProperty('selected', !event.feature.getProperty('selected'));

        var selectedFeatures = [];
        this.map.data.forEach(function(feature) {
          if (feature.getProperty('selected') === true) {
            selectedFeatures.push(feature);
          }
        }.bind(this));

        this.selectedFeatures = selectedFeatures;
        this.render();
      }.bind(this));

      this.map.data.addListener('mouseover', function(event) {
        if (event.feature.getProperty('fromUpload') !== true) { return; }
        if (this.availableFeatures.length <= 1) { return; }

        this.map.data.overrideStyle(event.feature, { fillOpacity: 0.5 });
      }.bind(this));

      this.map.data.addListener('mouseout', function(event) {
        if (event.feature.getProperty('fromUpload') !== true) { return; }
        if (this.availableFeatures.length <= 1) { return; }

        this.map.data.revertStyle();
      }.bind(this));
    },

    setupHandlers: function() {
      var dropZone = this.$('#drop-shape');

      var toggleClass = function () { dropZone.toggleClass('moving'); return false; };
      dropZone.on('dragover', toggleClass);
      dropZone.on('dragend', toggleClass);

      dropZone.on('drop', function (e) {
        e.preventDefault();

        var file = e.originalEvent.dataTransfer.files[0];
        var shapeService = new ShapefileService({ shapefile : file });
        shapeService.toGeoJSON().then(function(data) {
          var features = data.features;

          this.selectedFeatures = [];
          this.availableFeatures = features;

          this.render();

          this.map.data.setStyle(function(feature) {
            var fillOpacity = 0;

            if (feature.getProperty('selected') === true) {
              fillOpacity = 0.5;
            }

            return ({
              fillOpacity: fillOpacity,
              fillColor: '#F00',
              strokeColor: '#F00',
              strokeWeight: 2
            });
          });

          features.forEach(function(feature) {
            this.map.data.addGeoJson(feature);
          }.bind(this));

          this.map.data.forEach(function(feature) {
            // Mark data from this upload, so we don't touch existing
            // geoms
            feature.setProperty('fromUpload', true);
            feature.setProperty('selected', false);
          }.bind(this));

          var combinedFeature = data.features.reduce(turf.union);
          var bounds = geojsonUtilsHelper.getBoundsFromGeojson(combinedFeature);
          this.map.fitBounds(bounds);
        }.bind(this));

        return false;
      }.bind(this));
    },

    continue: function(event) {
      event.stopPropagation() && event.preventDefault();

      var featuresToReturn = [];
      if (this.selectedFeatures.length === 0) {
        featuresToReturn = this.availableFeatures;
      } else {
        this.selectedFeatures.forEach(function(f) {
          f.toGeoJson(featuresToReturn.push.bind(featuresToReturn));
        });
      }

      var combinedFeature = featuresToReturn.reduce(turf.union);
      this.onSelect(combinedFeature);
    },

    cancel: function() {
      this.clearMap();
      this.onCancel();

      this.selectedFeatures = [];
      this.availableFeatures = [];

      this.render();
      this.setupHandlers();
    },

    clearMap: function() {
      this.map.data.forEach(function(feature) {
        if (feature.getProperty('fromUpload') === true) {
          this.map.data.remove(feature);
        }
      }.bind(this));
    }

  });

  return ShapefileUploadView;

});
