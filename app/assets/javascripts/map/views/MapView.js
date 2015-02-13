/**
 * The MapView class for the Google Map.
 *
 * @return MapView class (extends Backbone.View)
 */

define([
  'backbone',
  'underscore',
  'mps',
  'map/presenters/MapPresenter',
  'map/views/maptypes/grayscaleMaptype',
  'map/views/maptypes/treeheightMaptype',
  'map/views/maptypes/landsatMaptype',
  'map/helpers/layersHelper'
], function(Backbone, _, mps, Presenter, grayscaleMaptype, treeheightMaptype, landsatMaptype, layersHelper) {

  'use strict';

  var MapView = Backbone.View.extend({

    el: '#map',

    /**
     * Google Map Options.
     */
    options: {
      minZoom: 3,
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
     * Constructs a new MapView and its presenter.
     */
    initialize: function() {
      this.presenter = new Presenter(this);
      this.layerInst = {};
      this.$maplngLng = $('.map-container .map-latlng');
      this.$viewFinder = $('#viewfinder');
      this.render();
    },

    /**
     * Creates the Google Maps and attaches it to the DOM.
     */
    render: function() {
      var params = {
        zoom: 3,
        mapTypeId: 'grayscale',
        center: new google.maps.LatLng(15, 27),
      };

      this.map = new google.maps.Map(this.el, _.extend({}, this.options, params));

      this.resize();
      this._setMaptypes();
      this._addListeners();

      this._checkDialogs();
    },

    /**
     * Wires up Google Maps API listeners so that the view can respond to user
     * events fired by the UI.
     */
    _addListeners: function() {
      google.maps.event.addListener(this.map, 'zoom_changed',
        _.bind(function() {
          this.onCenterChange();
        }, this)
      );
      google.maps.event.addListener(this.map, 'dragend',
        _.bind(function() {
          this.onCenterChange();
      }, this));

      google.maps.event.addListenerOnce(this.map, 'idle', _.bind(function() {
        this.$el.addClass('is-loaded');
      }, this));

      google.maps.event.addListener(this.map, 'click', _.bind(function(wdpa) {
        if (!(!!wdpa.wdpaid)) {
          return;
        }
        // TODO => No mps here!
        mps.publish('AnalysisTool/analyze-wdpaid', [wdpa]);
      }, this));
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

      if (!layersHelper[layer.slug].view || this.layerInst[layer.slug]) {
        _addNext();
        return;
      }

      var layerView = this.layerInst[layer.slug] =
        new layersHelper[layer.slug].view(layer, options, this.map);

      layerView.addLayer(this._getOverlayPosition(layer), _addNext);
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
    setCenter: function(lat, lng) {
      this.map.setCenter(new google.maps.LatLng(lat, lng));
    },

    getCenter: function() {
      var center = this.map.getCenter();

      return {lat: center.lat(), lng: center.lng()};
    },

    fitBounds: function(bounds) {
      this.map.fitBounds(bounds);
    },

    /**
     * Used by MapPresenter to set the map type.
     *
     * @param {string} maptype The map type id.
     */
    setMapTypeId: function(maptype) {
      this.map.setMapTypeId(maptype);
      this.presenter.onMaptypeChange(maptype);
    },

    getMapTypeId: function() {
      return this.map.getMapTypeId();
    },


    /**
     * Handles a map center change UI event by dispatching to MapPresenter.
     */
    onCenterChange: function() {
      var center = this.map.getCenter();
      var lat = center.lat();
      var lng = center.lng();
      this.presenter.onCenterChange(lat, lng);
      this.updateLatlngInfo(lat,lng);
    },

    /**
     * Resizes the map.
     */
    resize: function() {
      google.maps.event.trigger(this.map, 'resize');
      this.map.setZoom(this.map.getZoom());
      this.map.setCenter(this.map.getCenter());
    },

    /**
     * Set additional maptypes to this.map.
     */
    _setMaptypes: function() {
      this.map.mapTypes.set('grayscale', grayscaleMaptype());
      this.map.mapTypes.set('treeheight', treeheightMaptype());
      for (var i = 1999; i < 2013; i++) {
        this.map.mapTypes.set('landsat{0}'.format(i), landsatMaptype([i]));
      }
    },


    /**
     * Crosshairs when analysis is activated
     */
    crosshairs: function(){
      this.$viewFinder.addClass('hidden');
      this.$maplngLng.removeClass('hidden');
      this.$analysislatlng = $('#analysisLatlng');

      this.$el.on('mousemove', _.bind(this.updatePositionCrosshairs, this ))
    },

    updatePositionCrosshairs: function(event){
      var currentBounds = this.map.getBounds();
      var topLeftLatLng = new google.maps.LatLng( currentBounds.getNorthEast().lat(), currentBounds.getSouthWest().lng());
      var point = this.map.getProjection().fromLatLngToPoint( topLeftLatLng );
      point.x += event.offsetX / ( 1<<this.map.getZoom() );
      point.y += event.offsetY / ( 1<<this.map.getZoom() );

      var latlong = this.map.getProjection().fromPointToLatLng( point );
      this.updateLatlngAnalysis(latlong.lat(), latlong.lng());

    },
    /**
     * Updates
     */
    updateLatlngAnalysis: function(lat, lng) {
      var html = 'Lat/long: {0}, {1}'.format(lat.toFixed(6), lng.toFixed(6));
      this.$analysislatlng.html(html);
    },

    centerPositionCrosshairs: function(){
      this.$viewFinder.removeClass('hidden');
      this.$maplngLng.addClass('hidden');
      this.$el.off('mousemove');
      this.onCenterChange();
    },


    /**
     * Updates
     */
    updateLatlngInfo: function(lat, lng) {
      var html = 'Lat/long: {0}, {1}'.format(lat.toFixed(6), lng.toFixed(6));
      this.$maplngLng.html(html);
    },


    /**
    *
    */
    _checkDialogs: function() {
      $(document).ready(function(type){
        if (!sessionStorage.getItem('DIALOG')) return;
        var dialog = JSON.parse(sessionStorage.getItem('DIALOG'));

        if (!dialog.display) return;

        var $container = $('.map-container').find('.widget')[0],
            $trigger   = $( "<a data-source='" + dialog.type +"' class='source hidden hide' style='display: none'></a>" )
        $trigger.appendTo($container).trigger('click');
        sessionStorage.removeItem('DIALOG');
        window.setTimeout(function(){$('.backdrop').css('opacity', '0.3');},500);
      });
    }

  });

  return MapView;

});
