define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'topojson',
  'map/utils',
  'helpers/geojsonUtilsHelper',
  'map/services/LayerSpecService',
  'map/views/maptypes/grayscaleMaptype',
  'core/View',
  'countries/helpers/layersHelper',
  'mps',
  'text!countries/templates/widgets/legendMap.handlebars'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  topojson,
  utils,
  geojsonUtilsHelper,
  LayerSpecService,
  grayscaleMaptype,
  View,
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
      zoomControl: true,
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

    _subscriptions:[
      {
        'Regions/update': function(value) {

        }
      },
    ],

    initialize: function(params, options) {
      View.prototype.initialize.apply(this);
      this.paramsMap = _.extend({}, this.default, params);
      this.modules = options.modules;

      this.cache();
      this.render();
      this._setListeners();
      this.loadScrollEvent();
    },

    cache: function () {
      this.layerInst = {};
      this.currentSection = null;
      this.forceSection = false;
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

        if (!this.forceSection) {
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

              setTimeout(function(lastSection) {
                if (lastSection === this.currentSection) {
                  this._updateLayer();
                  this._updateLegend(section);
                }
              }.bind(this, section), 500);
            }
          }.bind(this));
        }
      }.bind(this));
    },

    setGeom: function() {
      if(this.paramsMap.region) {
        var geometry = JSON.parse(this.paramsMap.countryData.geojson);
        bounds = geojsonUtilsHelper.getBoundsFromGeojson(geometry);
        this.drawGeojson(geometry);
        this.map.fitBounds(bounds)

      } else {
        var resTopojson = JSON.parse(this.paramsMap.countryData.topojson);
        var objects = _.findWhere(resTopojson.objects, {
          type: 'MultiPolygon'
        });
        var topoJson = topojson.feature(resTopojson,objects),
            geojson = topoJson.geometry,
            bounds = geojsonUtilsHelper.getBoundsFromGeojson(geojson);
      }

      this.drawGeojson(geojson);
      this.map.fitBounds(bounds);
      this.map.setZoom(this.map.getZoom() + 1);
    },

    toogleLayer: function(e) {
      var target = $(e.target);
      var section = target.data('section');

      _.each(this.$el.find('.onoffswitch'), function(toggle) {
        var $toggle = $(toggle);
        var optionSelected = $toggle.hasClass('checked');
        if (optionSelected) {
          $toggle.removeClass('checked');
        }
      });
      target.addClass('checked');
      if (section) {
        $('html,body').animate(
          {
            scrollTop: $("#"+section).offset().top
          },'slow'
        );
        this.currentSection = section;
        this.forceSection = true;
        this._updateLayer();
      } else {
        this.currentSection = null;
        this.forceSection = false;
        this._removeAllLayers();
      }
    },

    toggleLayerSpec: function () {
      var layerData = this._getLayerDataSection(this.currentSection);
      var where = [{ slug: layerData.slug }];

      LayerSpecService.toggle(where,
        function(layerSpec) {
          this.setLayers(layerSpec.getLayers(), layerData.options);
        }.bind(this)
      );
    },

    _updateLayer: function () {
      this._removeAllLayers();
      this.toggleLayerSpec();
    },

    _updateLegend: function (section) {
      $('.js-toggle-layer').each(function(i, obj) {
        if ($(obj).hasClass('checked')) {
          $(this).removeClass('checked');
        }
        if ($(obj).data('section') === section) {
          $(this).addClass('checked');
        }
      });
    },

    _getLayerDataSection: function (section) {
      var data;
      switch (section) {
        case 'cover-loss':
          data = {
            slug: 'terrailoss',
            options: {
              currentDate: [
                moment.utc(this.modules.treeCoverLoss[0].status.attributes.minYear, 'YYYY'),
                moment.utc(this.modules.treeCoverLoss[0].status.attributes.maxYear, 'YYYY')
              ],
              threshold: this.modules.treeCoverLoss[0].status.attributes.threshValue
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
            options: {
              currentDate: [moment().subtract(7, 'days').utc(), moment().utc()],
              infowindow: false
            }
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

    _removeAllLayers: function() {
      _.each(this.layerInst, function(inst, layerSlug) {
        if (!inst) {return;}
        inst.removeLayer();
        inst.presenter && inst.presenter.unsubscribe && inst.presenter.unsubscribe();
        this.layerInst[layerSlug] = null;
      }, this);
      LayerSpecService._removeAllLayers();
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
