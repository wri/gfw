define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'topojson',
  'core/View',
  'map/utils',
  'helpers/geojsonUtilsHelper',
  'map/services/LayerSpecService',
  'map/views/maptypes/grayscaleMaptype',
  'countries/helpers/layersHelper',
  'mps',
  'text!countries/templates/widgets/legendMap.handlebars'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  topojson,
  View,
  utils,
  geojsonUtilsHelper,
  LayerSpecService,
  grayscaleMaptype,
  layersHelper,
  mps,
  tpl) {

  'use strict';

  var MapCountry = View.extend({

    el: '#map',
    template: Handlebars.compile(tpl),

    events: {
      'click .js-toggle-layer' : 'toogleLayer',
    },

    /**
     * Google Map Options.
     */
    default: {
      minZoom: 1,
      backgroundColor: '#99b3cc',
      disableDefaultUI: true,
      panControl: false,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      overviewMapControl: false,
      tilt: 0,
      center: {lat: -34.397, lng: 150.644},
      scrollwheel: false,
      zoom: 4,
      mapTypeId: 'grayscale'
    },
    currentSection: null,

    initialize: function(params, options) {
      this.paramsMap = _.extend({}, this.default, params);
      this.modules = options.modules;
      this.layerInst = {};
      this.cache();
      this.render();
      this._setListeners();
      this.loadScrollEvent();
    },

    cache: function () {
      this.widgets = $('.js-country-widget');
      this.scrollVisualGap = 300;
    },

    render: function() {
      this.map = new google.maps.Map(this.el, this.paramsMap);
      this.map.mapTypes.set('grayscale', grayscaleMaptype());
      this.setGeom();
      this.$el.append(this.template());
    },

    _setListeners: function() {
      mps.subscribe('TreeCoverLossAlerts/update', _.bind(function(){
        if (this.currentSection === 'cover-loss-alerts') {
          this._updateLayer();
        }
      }, this));
      mps.subscribe('AnnualTreeCoverLoss/update', _.bind(function(){
        if (this.currentSection === 'cover-loss') {
          this._updateLayer();
        }
      }, this));
    },

    loadScrollEvent: function () {
      $(window).scroll(function () {
        var scrollTop = $(window).scrollTop() + this.scrollVisualGap;

        _.each(this.widgets, function(item) {
          var widget = $(item);
          var section = widget.data('section');
          var offset = widget.offset();
          var scrollPositionTop = offset.top;
          var scrollPositionBottom = scrollPositionTop + widget.height();

          if (this.currentSection !== section &&
            scrollTop >= scrollPositionTop &&
            scrollTop <= scrollPositionBottom) {
            this.currentSection = section;

            setTimeout(function() {
              this.toggleLayerSpec(section);
            }.bind(this), 1000);
          }
        }.bind(this));
      }.bind(this));
    },

    setGeom: function() {
      var resTopojson = JSON.parse(this.paramsMap.countryData.topojson);
      var objects = _.findWhere(resTopojson.objects, {
        type: 'MultiPolygon'
      });
      var topoJson = topojson.feature(resTopojson,objects),
          geojson = topoJson.geometry,
          bounds = geojsonUtilsHelper.getBoundsFromGeojson(geojson);

      this.drawGeojson(geojson);
      this.map.fitBounds(bounds);
      this.map.setZoom(this.map.getZoom() + 1);
    },

    toogleLayer: function(e){
      _.each(this.$el.find('.onoffswitch'), function(toggle) {
        var $toggle = $(toggle);
        var optionSelected = $toggle.hasClass('checked');
        if (optionSelected) {
          $toggle.removeClass('checked');
        }
      });
      $(e.target).addClass('checked');
    },

    toggleLayerSpec: function (section) {
      if (section === this.currentSection) {
        var layerData = this._getLayerDataSection(this.currentSection);
        var where = [{ slug: layerData.slug }];

        LayerSpecService.toggle(where,
          function(layerSpec) {
            this.setLayers(layerSpec.getLayers(), layerData.options);
          }.bind(this)
        );
      }
    },

    _updateLayer: function () {
      LayerSpecService._removeAllLayers();
      this.toggleLayerSpec(this.currentSection);
    },

    _getLayerDataSection: function (section) {
      var data;
      switch (section) {
        case 'cover-loss':
          data = {
            slug: 'terrailoss',
            options: {
              currentDate: [moment.utc().subtract(10, 'year'), moment.utc()],
              threshold: 30
            }
          };
          break;
        case 'cover-gain':
          data = {
            slug: 'forestgain',
            options: {}
          };
          break;
        case 'cover-loss-alerts':
          data = {
            slug: this.modules.treeCoverLossAlerts[0].status.attributes.layerLink,
            options: {}
          };
          break;
        case 'fires':
          data = {
            slug: 'viirs_fires_alerts',
            options: {}
          };
          break;
      }

      return data;
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

    _removeLayer: function(layerSlug) {
      var inst = this.layerInst[layerSlug];
      if (!inst) {return;}
      inst.removeLayer();
      inst.presenter && inst.presenter.unsubscribe && inst.presenter.unsubscribe();
      this.layerInst[layerSlug] = null;
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
     * DRAW & DELETE & UPDATE GEOJSONS
     * - drawGeojson
     * - deleteGeojson
     * - updateGeojson
    */

    drawGeojson: function(geojson) {
      var geojson = geojson;
      var paths = geojsonUtilsHelper.geojsonToPath(geojson);
      var overlay = new google.maps.Polygon({
        paths: paths,
        editable: false,
        strokeWeight: 1.5,
        fillOpacity: 0,
        fillColor: '#FFF',
        strokeColor: '#A2BC28'
      });

      overlay.setMap(this.map);
    },

    deleteGeojson: function() {
    },

    /**
    * updateGeojson
    * @param  {[object]} overlay
    * @return {void}
    */
    updateGeojson: function(overlay) {

    },

  });
  return MapCountry;
});
