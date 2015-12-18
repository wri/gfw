define([
  'backbone', 'underscore', 'handlebars', 'mps', 'turf',
  'helpers/geojsonUtilsHelper',
  'map/services/ShapefileService',
  'text!map/templates/tabs/subscription_upload.handlebars'
], function(
  Backbone, _, Handlebars, mps, turf,
  geojsonUtilsHelper,
  ShapefileService,
  tpl
) {

  var SubscriptionUploadView = Backbone.View.extend({

    template: Handlebars.compile(tpl),

    events: {
      'click #start-subscription': 'startSubscription'
    },

    initialize: function(options) {
      options = options || {};
      this.map = options.map;

      this.selectedFeatures = [];
      this.availableFeatures = [];

      this.render();
      this.setupHandlers();
    },

    render: function() {
      this.$el.html(this.template({
        availableFeatures: this.availableFeatures,
        multipleFeatures: this.availableFeatures.length > 1,
        selectedFeatures: this.selectedFeatures
      }));

      return this;
    },

    setupHandlers: function() {
      var dropZone = this.$('#drop-shape');

      var toggleClass = function () { dropZone.toggleClass('moving'); return false; };
      dropZone.on('dragover', toggleClass);
      dropZone.on('dragend', toggleClass);

      dropZone.on('drop', function (e) {
        e.preventDefault();

        var file = e.originalEvent.dataTransfer.files[0];
        var shapeService = new ShapefileService({
          shapefile : file });
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

          if (this.availableFeatures.length > 1) {
            this.map.data.addListener('click', function(event) {
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
              this.map.data.overrideStyle(event.feature, {
                fillOpacity: 0.5
              });
            }.bind(this));

            this.map.data.addListener('mouseout', function(event) {
              this.map.data.revertStyle();
            }.bind(this));
          }

          features.forEach(function(feature) {
            this.map.data.addGeoJson(feature);
          }.bind(this));

          var combinedFeature = data.features.reduce(turf.union);
          var bounds = geojsonUtilsHelper.getBoundsFromGeojson(combinedFeature);
          this.map.fitBounds(bounds);
        }.bind(this));

        return false;
      }.bind(this));
    },

    startSubscription: function(event) {
      event.stopPropagation() && event.preventDefault();

      var featuresForSubscription;
      if (this.selectedFeatures.length === 0) {
        featuresForSubscription = this.availableFeatures;
      } else {
        var featuresForSubscription = [];
        var combinedFeature = this.selectedFeatures.forEach(function(f) {
          f.toGeoJson(function(geojson) {
            featuresForSubscription.push(geojson);
          });
        });
      }

      var combinedFeature = featuresForSubscription.reduce(turf.union);
      mps.publish('Subscription/upload', [combinedFeature.geometry]);
    }

  });

  return SubscriptionUploadView;

});
