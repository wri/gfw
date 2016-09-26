/**
 * The MapMiniView class for the Google Map.
 *
 * @return MapMiniView class (extends Backbone.View)
 */

define([
  'backbone',
  'underscore',
  'mps',
  'cookie',
  'topojson',
  'core/View',
  'map/views/maptypes/grayscaleMaptype',
  'map/services/GeostoreService',
  'map/services/ShapeService',
  'map/services/CountryService',
  'map/services/RegionService',
  'map/helpers/layersHelper',
  'helpers/geojsonUtilsHelper',
], function(Backbone, _, mps, Cookies, topojson, View, grayscaleMaptype, GeostoreService, ShapeService, CountryService, RegionService, layersHelper, geojsonUtilsHelper) {

  'use strict';

  var MapMiniView = View.extend({

    el: '#map',

    status: new (Backbone.Model.extend({
      defaults: {
        is_drawing: false,
        geojson: null,
        geostore: null,
        overlay: null,
        overlay_stroke_weight: 2
      }
    })),

    /**
     * Google Map Options.
     */
    options: {
      zoom: 3,
      minZoom: 3,
      mapTypeId: 'grayscale',
      center: new google.maps.LatLng(15, 27),
      backgroundColor: '#99b3cc',
      disableDefaultUI: true,
      panControl: false,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      overviewMapControl: false
    },

    /**
     * Constructs a new MapMiniView and its presenter.
     */
    initialize: function() {
      if (!this.$el.length) {
        return;
      }

      View.prototype.initialize.apply(this);

      this.layerInst = {};
      this.render();
      this.cache();
      this.listeners();
    },

    cache: function() {
      this.$mapLoader = $('#map-loader');
    },

    listeners: function() {
      this.listenTo(this.status, 'change:geojson', this.changeGeojson.bind(this));
      this.listenTo(this.status, 'change:geostore', this.changeGeostore.bind(this));
    },

    _subscriptions: [
      // MAP STATE
      {
        'Map/loading': function(loading){
          var time = (!loading) ? 250 : 0;
          setTimeout(function(){
            this.$mapLoader.toggleClass('-start', loading);
          }.bind(this), time);
        }
      },
      {
        'Map/fit-bounds': function(bounds){
          this.map.fitBounds(bounds)
        }
      },

      // LAYERS
      {
        'LayerNav/change': function(layerSpec){
          var options = {
            highlight: true
          };
          var layers = layerSpec.getLayers();
          this.status.set('layers',layers);
          this.setLayers(layers, options);

          // Delete geojson if it exists
          this.deleteGeojson();
        }
      },

      // HIGHLIGHT
      {
        'Country/update': function(iso) {
          var iso = iso;
          if (!!iso && !!iso.country) {
            this.getCountryShape(iso);
          }
        }
      },

      {
        'Shape/update': function(data) {
          if (!!data.wdpaid) {
            this.getShape('protected_areas', data.wdpaid);
          }

          if (!!data.use && !!data.useid) {
            this.getShape(data.use, data.useid);
          }
        }
      },

      // DRAWING
      {
        'Drawing/toggle': function(toggle){
          this.status.set('is_drawing', toggle);
        }
      },

      {
        'Drawing/overlay': function(overlay){
          this.status.set('overlay', overlay);
          this.status.set('geojson', this.getGeojson(overlay));
          this.eventsGeojson();
        }
      },

      {
        'Drawing/geojson': function(geojson){
          this.status.set('geojson', geojson);
          this.drawGeojson();
        }
      },

      {
        'Drawing/bounds': function(bounds){
          this.map.fitBounds(bounds);
        }
      },

      {
        'Drawing/delete': function(){
          this.deleteGeojson();
        }
      },

    ],

    /**
     * Creates the Google Maps and attaches it to the DOM.
     */
    render: function() {
      this.map = new google.maps.Map(this.el, _.extend({}, this.options));
      this._setMaptypes();
      this._addMapListeners();
    },

    /**
     * Wires up Google Maps API listeners so that the view can respond to user
     * events fired by the UI.
     */
    _addMapListeners: function() {
    },


    /**
     * Set map options from the suplied options object.
     *
     * @param {Object} options
     */
    setOptions: function(options) {
      this.map.setOptions(options);
      this.onCenterChange();
      this.presenter.onMaptypeChange(options.mapTypeId);
    },

    /**
     * Add passed layers to the map and remove the rest.
     *
     * @param {object} layers  Layers object
     * @param {object} options Layers options from url
     */
    setLayers: function(layers, options) {
      _.each(this.layerInst, function(inst, layerSlug) {
        !layers[layerSlug] && this._removeLayer(layerSlug);
      }, this);

      layers = _.sortBy(_.values(layers), 'position');
      this._addLayers(layers, options);
    },

    /**
     * Add layers to the map one by one, waiting until the layer before
     * is already rendered. This way we can get the layer order right.
     *
     * @param {array}   layers  layers array
     * @param {object}  options layers options eg: threshold, currentDate
     * @param {integer} i       current layer index
     */
    _addLayers: function(layers, options, i) {
      i = i || 0;
      var layer = layers[i];

      var _addNext = _.bind(function() {
        i++;
        layers[i] && this._addLayers(layers, options, i);
      }, this);

      if (layer && !!layersHelper[layer.slug]) {
        if ((!layersHelper[layer.slug].view || this.layerInst[layer.slug])) {
          _addNext();
          return;
        }

        var layerView = this.layerInst[layer.slug] =
          new layersHelper[layer.slug].view(layer, options, this.map);

        layerView.addLayer(layer.position, _addNext);
      }

    },

    /**
     * Get layer position. If layer.position doesn't exist,
     * position is 0 (at the bottom), else it calculates the right position.
     *
     * @param  {object} layer
     * @return {integer} position
     */
    _getOverlayPosition: function(layer) {
      var position = 0;
      var layersCount = this.map.overlayMapTypes.getLength();
      if (typeof layer.position !== 'undefined' && layer.position <= layersCount) {
        position = layersCount - layer.position;
      }
      return position;
    },

    /**
     * Used by MapPresenter to remove a layer by layerSlug.
     *
     * @param  {string} layerSlug The layerSlug of the layer to remove
     */
    _removeLayer: function(layerSlug) {
      var inst = this.layerInst[layerSlug];
      if (!inst) {return;}
      inst.removeLayer();
      inst.presenter && inst.presenter.unsubscribe && inst.presenter.unsubscribe();
      this.layerInst[layerSlug] = null;
    },

    updateLayer: function(layerSlug) {
      var options = {};
      var layer = this.layerInst[layerSlug];
      options.currentDate = layer.currentDate ? layer.currentDate : null;
      options.threshold = layer.threshold ? layer.threshold : null;
      this._removeLayer(layerSlug);
      this._addLayers([layer.layer], options);
    },



    /**
     * Used by MapPresenter to set the map center.
     *
     * @param {Number} lat The center latitude
     * @param {Number} lng The center longitude
    */
    // Center
    getCenter: function() {
      var center = this.map.getCenter();
      return {
        lat: center.lat(),
        lng: center.lng()
      };
    },
    setCenter: function(lat, lng) {
      this.map.setCenter(new google.maps.LatLng(lat, lng));
    },

    // Zoom
    getZoom: function() {
      this.map.getZoom();
    },
    setZoom: function(zoom) {
      this.map.setZoom(zoom);
    },

    // COUNTRIES
    getCountryShape: function(iso) {
      var iso = iso;
      if (!!iso.country) {
        if (!!iso.region) {
          RegionService.show(iso.country, iso.region)
            .then(function(results,status) {
              var geojson = results.features[0].geometry,
                  bounds = geojsonUtilsHelper.getBoundsFromGeojson(geojson);

              // Get bounds and fit to them
              if (!!bounds) {
                mps.publish('Map/fit-bounds', [bounds]);
              }

              // Draw geojson of country
              this.deleteGeojson();
              this.drawGeojson(geojson);
            }.bind(this));

        } else {
          CountryService.show(iso.country)
            .then(function(results,status) {
              var objects = _.findWhere(results.topojson.objects, {
                type: 'MultiPolygon'
              });
              var topoJson = topojson.feature(results.topojson,objects),
                  geojson = topoJson.geometry,
                  bounds = geojsonUtilsHelper.getBoundsFromGeojson(geojson);

              // Get bounds and fit to them
              if (!!bounds) {
                mps.publish('Map/fit-bounds', [bounds]);
              }

              // Draw geojson of country
              this.deleteGeojson();
              this.drawGeojson(geojson);

            }.bind(this));
        }
      }

    },

    // SHAPES
    getShape: function(type, id) {
      ShapeService.get(type, id)
        .then(function(geojson, status){
          var geojson = geojson,
              bounds = geojsonUtilsHelper.getBoundsFromGeojson(geojson);

          // Get bounds and fit to them
          if (!!bounds) {
            mps.publish('Map/fit-bounds', [bounds]);
          }

          // Draw geojson of shape
          if (!!geojson) {
            this.deleteGeojson();
            this.drawGeojson(geojson);
          }
        }.bind(this))

        .catch(function(error){
          console.log(arguments);
        }.bind(this))

    },

    /**
     * Used by MapPresenter to set the map type.
     *
     * @param {string} maptype The map type id.
     */
    setMapTypeId: function(maptype) {
      this.map.setMapTypeId(maptype);
    },

    getMapTypeId: function() {
      return this.map.getMapTypeId();
    },

    /**
     * Set additional maptypes to this.map.
     */
    _setMaptypes: function() {
      this.map.mapTypes.set('grayscale', grayscaleMaptype());
    },

    /**
     * CHANGE EVENTS
     * - changeGeojson
     * - changeGeostore
    */
    changeGeojson: function() {
      var geojson = this.status.get('geojson');

      if (!!geojson) {
        GeostoreService.save(geojson).then(function(geostoreId) {
          this.status.set('geostore', geostoreId);
        }.bind(this));
      } else {
        this.status.set('geostore', null);
      }
    },

    changeGeostore: function() {
      mps.publish('Drawing/geostore', [this.status.get('geostore')]);
    },



    /**
     * DRAW & DELETE & UPDATE GEOJSONS
     * - drawGeojson
     * - deleteGeojson
     * - getGeojson
     * - updateGeojson
     * - eventsGeojson
    */

    drawGeojson: function(geojson) {
      var geojson = geojson || this.status.get('geojson');
      var paths = geojsonUtilsHelper.geojsonToPath(geojson);
      var overlay = new google.maps.Polygon({
        paths: paths,
        // TODO: Editable if it's a drawn Polygon
        editable: false,
        strokeWeight: this.status.get('overlay_stroke_weight'),
        fillOpacity: 0,
        fillColor: '#FFF',
        strokeColor: '#A2BC28'
      });

      overlay.setMap(this.map);

      this.status.set('overlay', overlay, { silent: true });
      this.status.set('geojson', this.getGeojson(overlay), { silent: true });

      this.eventsGeojson();

      if (this.status.get('fit_to_geom')) {
        this.map.fitBounds(overlay.getBounds());
      }
    },

    deleteGeojson: function() {
      var overlay = this.status.get('overlay');
      if (!!overlay) {
        overlay.setMap(null);
        this.status.set('overlay', null);
        this.status.set('geojson', null);
      }
    },

    getGeojson: function(overlay) {
      var paths = overlay.getPath().getArray();
      return geojsonUtilsHelper.pathToGeojson(paths);
    },

    /**
    * updateGeojson
    * @param  {[object]} overlay
    * @return {void}
    */
    updateGeojson: function(overlay) {
      this.status.set('overlay', overlay);
      this.status.set('geojson', this.getGeojson(overlay));
    },

    eventsGeojson: function() {
      var overlay = this.status.get('overlay');

      google.maps.event.addListener(overlay.getPath(), 'set_at', function () {
        this.updateGeojson(overlay);
      }.bind(this));

      google.maps.event.addListener(overlay.getPath(), 'insert_at', function () {
        this.updateGeojson(overlay);
      }.bind(this));

      google.maps.event.addListener(overlay.getPath(), 'remove_at', function () {
        this.updateGeojson(overlay);
      }.bind(this));
    },

  });

  return MapMiniView;

});
